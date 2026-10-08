#!/bin/sh
# Copy the playable page into docs/ (for GitHub Pages: Settings > Pages > Deploy from branch > /docs).
# There is no compile step; this only copies index.html, css/, js/ and assets/. docs/STORY.md is left alone.
set -e
cd "$(dirname "$0")/.."
rm -rf docs/js docs/css docs/assets docs/index.html
cp index.html docs/
cp -R css js assets docs/
touch docs/.nojekyll
echo "Built docs/ ($(find docs -type f | wc -l | tr -d ' ') files)"
