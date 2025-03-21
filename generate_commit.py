#!/usr/bin/env python3
"""
Script to generate a commit message based on git diff output.
This will be used by git_commit.sh to get AI-generated commit messages.
"""

import subprocess
import sys
import os

def get_git_diff():
    """Get the git diff of staged changes."""
    try:
        result = subprocess.run(
            ["git", "diff", "--staged"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError:
        return ""

def get_git_status():
    """Get the git status output."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError:
        return ""
        
def generate_commit_message():
    """Generate a commit message based on the changes."""
    diff = get_git_diff()
    status = get_git_status()
    
    if not diff and not status:
        return "Update site"
    
    # Get file changes summary
    try:
        diff_stat = subprocess.run(
            ["git", "diff", "--staged", "--stat"],
            capture_output=True,
            text=True,
            check=True
        )
        changes = diff_stat.stdout
    except subprocess.CalledProcessError:
        changes = status
    
    # Generate descriptive message
    files_changed = status.count("\n")
    message = ""
    
    if "index.html" in status:
        message += "Update main page"
    elif ".html" in status:
        message += "Update page content"
    elif ".css" in status:
        message += "Update styling"
    elif ".js" in status:
        message += "Update functionality"
    elif "git_commit" in status:
        message += "Improve deployment script"
    elif "README" in status:
        message += "Update documentation"
    elif "images/" in status or ".jpg" in status or ".png" in status:
        message += "Add/update images"
    else:
        message += "Update site"
    
    # Add detail if only one file changed
    if files_changed == 1:
        file_name = status.strip().split()[-1]
        if file_name != "index.html" and "." in file_name:
            message += f" ({os.path.basename(file_name)})"
    
    return message

if __name__ == "__main__":
    message = generate_commit_message()
    
    # Save to temporary file for git_commit.sh to use
    with open("/tmp/git_commit_msg.txt", "w") as f:
        f.write(message)
    
    # Also print to stdout
    print(message) 