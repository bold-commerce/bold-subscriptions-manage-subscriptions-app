echo "eslint pre commit hook start"

ESLINT="node_modules/.bin/eslint"
HAS_ESLINT=false

if [ -x $ESLINT ]; then
    HAS_ESLINT=true
fi

if $HAS_ESLINT; then
  set -e
  # git status --porcelain | grep -e '^[AM].*src\/.*\.js' | cut -c 3- | while read line; do
  #   echo "linting $line";
  #   $ESLINT -c 'src/.eslintrc' --fix --quiet "$line";
  #   git add "$line";
  # done
  $ESLINT src;
else
  echo ""
  echo "Make sure you install before committing"
  echo ""
  echo "  yarn install"
  echo ""
fi
echo "eslint pre commit hook finish"