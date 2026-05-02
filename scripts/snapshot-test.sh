#!/bin/bash
# Snapshot test: builds the site, then diffs prerendered HTML against committed snapshots.
# Usage:
#   npm run test:snapshots         # compare against committed snapshots
#   npm run test:snapshots:update   # update snapshots to current build
set -euo pipefail

SNAP_DIR="snapshots"
DIST_DIR="dist"

# Normalize HTML for comparison: strip asset hashes and modulepreload lines
normalize() {
  sed -E \
    -e 's/index-[A-Za-z0-9]+\./index-HASH./g' \
    -e 's/prerender-[A-Za-z0-9]+\./prerender-HASH./g' \
    -e '/<link rel="modulepreload"/d' \
    "$1"
}

if [ "${1:-}" = "--update" ]; then
  echo "Building..."
  npm run build --silent
  rm -rf "$SNAP_DIR"
  mkdir -p "$SNAP_DIR"
  find "$DIST_DIR" -name 'index.html' | while read -r f; do
    rel="${f#$DIST_DIR/}"
    dir=$(dirname "$rel")
    if [ "$dir" = "." ]; then name="root"; else name=$(echo "$dir" | tr '/' '_'); fi
    normalize "$f" > "$SNAP_DIR/${name}.html"
  done
  echo "Updated $(ls "$SNAP_DIR" | wc -l) snapshots."
  exit 0
fi

# Compare mode
if [ ! -d "$SNAP_DIR" ] || [ -z "$(ls -A "$SNAP_DIR" 2>/dev/null)" ]; then
  echo "No snapshots found. Run: npm run test:snapshots:update"
  exit 1
fi

echo "Building..."
npm run build --silent

failed=0
for snap in "$SNAP_DIR"/*.html; do
  name=$(basename "$snap" .html)
  if [ "$name" = "root" ]; then
    dist_file="$DIST_DIR/index.html"
  else
    dist_file="$DIST_DIR/$(echo "$name" | tr '_' '/')/index.html"
  fi

  if [ ! -f "$dist_file" ]; then
    echo "FAIL: $name — dist file missing: $dist_file"
    failed=1
    continue
  fi

  if ! diff -u "$snap" <(normalize "$dist_file") > /dev/null 2>&1; then
    echo "FAIL: $name — HTML differs"
    diff -u "$snap" <(normalize "$dist_file") | head -20
    failed=1
  else
    echo "PASS: $name"
  fi
done

if [ $failed -ne 0 ]; then
  echo ""
  echo "Snapshot test failed. Run 'npm run test:snapshots:update' to update."
  exit 1
fi

echo ""
echo "All snapshots match."
