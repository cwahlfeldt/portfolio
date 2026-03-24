#!/bin/bash

# Simple HTML template builder
# Uses partials/base.html as the layout, replaces {{ content }} with page content

BASE="partials/base.html"
DIST="dist"

build_page() {
  local page="$1"
  local dir=$(dirname "$page" | sed 's|^\./||')

  mkdir -p "$DIST/$dir"

  if [ "$dir" = "." ]; then
    asset_prefix="."
  else
    depth=$(echo "$dir" | tr '/' '\n' | wc -l | tr -d ' ')
    asset_prefix=$(printf '../%.0s' $(seq 1 "$depth"))
    asset_prefix="${asset_prefix%/}"
  fi

  base_content=$(cat "$BASE")
  page_content=$(cat "$page")

  base_content="${base_content//\{\{ asset_prefix \}\}/$asset_prefix}"

  before="${base_content%%\{\{ content \}\}*}"
  after="${base_content#*\{\{ content \}\}}"

  echo "${before}${page_content}${after}" > "$DIST/$dir/index.html"
  echo "Built: $DIST/$dir/index.html"
}

build_all() {
  find . -name "index.html" -not -path "./partials/*" -not -path "./dist/*" | while read -r page; do
    build_page "$page"
  done
  rsync -a --delete assets/ "$DIST/assets/"
}

# Initial full build
mkdir -p "$DIST"
build_all
touch "$DIST/.stamp"
echo "Done!"

if [ "$1" = "--serve" ]; then
  while true; do
    # Single find: any source file newer than our stamp?
    if [ "$BASE" -nt "$DIST/.stamp" ]; then
      echo "Base changed, rebuilding all..."
      build_all
      touch "$DIST/.stamp"
    else
      rebuilt=false

      # Check individual pages (just stat comparisons)
      find . -name "index.html" -not -path "./partials/*" -not -path "./dist/*" | while read -r page; do
        dir=$(dirname "$page" | sed 's|^\./||')
        out="$DIST/$dir/index.html"
        if [ ! -f "$out" ] || [ "$page" -nt "$out" ]; then
          build_page "$page"
        fi
      done

      # Check assets: any file newer than stamp?
      if [ -n "$(find assets/ -newer "$DIST/.stamp" -print -quit 2>/dev/null)" ]; then
        echo "Assets changed, syncing..."
        rsync -a --delete assets/ "$DIST/assets/"
        touch "$DIST/.stamp"
      fi
    fi

    sleep 0.3
  done &
  WATCH_PID=$!
  trap "kill $WATCH_PID 2>/dev/null" EXIT

  cd "$DIST"
  npx live-server
fi
