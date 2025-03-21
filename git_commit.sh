#!/bin/bash
set -e

# Simple script to commit changes and deploy to GitHub Pages
INCLUDE_FILES="*.html css/ js/ images/ components/ work/ scripts/ .nojekyll .safe"
EXCLUDE_FILES="RESPONSIVE.md git_commit.sh MODERNIZATION.md"

echo "Starting git commit and deploy..."

# Make sure we're on main branch
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "Switching to main branch..."
  git checkout main
fi

# Commit any changes on main if needed
if [ -n "$(git status --porcelain)" ]; then
  echo "Changes detected, committing to main..."
  git add .
  git commit -m "Update site"
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
  git commit -m "Deploy site"
  git push origin gh-pages
  echo "✓ Live site updated!"
else
  echo "✓ Live site already up to date"
fi

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"