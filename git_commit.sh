#!/bin/bash
set -e

# Simple script to commit changes and deploy to GitHub Pages
INCLUDE_FILES="*.html css/ js/ images/ components/ work/ scripts/ .nojekyll .safe"
EXCLUDE_FILES="RESPONSIVE.md git_commit.sh MODERNIZATION.md"

echo "Starting git commit and deploy..."

# Function to generate AI commit messages using cursor cli
generate_commit_message() {
  # Get the diff of staged changes
  DIFF_OUTPUT=$(git diff --staged)
  
  # If cursor CLI is available, use it to generate commit message
  if command -v cursor &> /dev/null; then
    COMMIT_MSG=$(echo "$DIFF_OUTPUT" | cursor --cli "Generate a comprehensive git commit message for these changes. Keep it under 100 characters but be specific about what changed." | tr -d '\n')
    echo "$COMMIT_MSG"
  else
    # Fallback if cursor is not available
    echo "Update site"
  fi
}

# Make sure we're on main branch
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "Switching to main branch..."
  git checkout main
fi

# Commit any changes on main if needed
if [ -n "$(git status --porcelain)" ]; then
  echo "Changes detected, staging and generating commit message..."
  git add .
  
  # Generate commit message
  COMMIT_MSG=$(generate_commit_message)
  echo "Using commit message: $COMMIT_MSG"
  
  git commit -m "$COMMIT_MSG"
  git push origin main
  echo "✓ Changes pushed to main"
else
  echo "✓ Main branch is up to date"
fi

# Switch to gh-pages and update it
echo "Updating gh-pages branch..."
git checkout gh-pages
git pull origin gh-pages

# Save README.md from gh-pages if it exists
if [ -f "README.md" ]; then
  cp README.md README.md.bak
fi

# Copy files from main branch
echo "Copying files from main branch..."
git checkout main -- $INCLUDE_FILES

# Restore gh-pages README
if [ -f "README.md.bak" ]; then
  mv README.md.bak README.md
fi

# Remove files we don't want on the live site
echo "Cleaning up files not needed for live site..."
for file in $EXCLUDE_FILES; do
  if [ -f "$file" ]; then
    rm -f "$file"
  fi
done

# Commit and push changes to gh-pages
git add .
if [ -n "$(git status --porcelain)" ]; then
  echo "Pushing updates to live site..."
  DEPLOY_MSG="Deploy site: $(date +'%Y-%m-%d %H:%M')"
  git commit -m "$DEPLOY_MSG"
  git push origin gh-pages
  echo "✓ Live site updated!"
else
  echo "✓ Live site already up to date"
fi

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"