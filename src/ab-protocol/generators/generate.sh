#!/bin/sh

BASEDIR=$(dirname "$0")
cd "$BASEDIR"

echo "Generate marshaling..."
node ./generate-marshaling.js

echo "Generate unmarshaling..."
node ./generate-unmarshaling.js

