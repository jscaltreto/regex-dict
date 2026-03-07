#!/bin/bash
set -euo pipefail

WORDS_URL="https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
PUBLIC_DIR="$(dirname "$0")/../public"
TMP_FILE="/tmp/words_raw.txt"

echo "Downloading word list..."
curl -fL "$WORDS_URL" -o "$TMP_FILE"

echo "Processing..."
sort -u "$TMP_FILE" > "$PUBLIC_DIR/words.txt"

WORD_COUNT=$(wc -l < "$PUBLIC_DIR/words.txt")
echo "Words: $WORD_COUNT"

echo "Compressing..."
gzip -9 -f "$PUBLIC_DIR/words.txt"
# gzip removes the source file when not using -k, leaving only words.txt.gz

SIZE=$(du -sh "$PUBLIC_DIR/words.txt.gz" | cut -f1)
echo "Done: public/words.txt.gz ($SIZE)"

rm -f "$TMP_FILE"
