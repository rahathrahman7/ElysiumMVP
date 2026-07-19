#!/usr/bin/env bash
# One-time Google Drive MCP setup for Cursor.
#
# 1. Download OAuth Desktop credentials from Google Cloud Console
# 2. Save as secrets/google-oauth-credentials.json (or pass path as arg)
# 3. Run: bash scripts/setup-google-drive-mcp.sh
# 4. Reload Cursor (Cmd+Shift+P → "Reload Window")
# 5. Run auth: npx mcp-google-gdrive --auth primary

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/secrets/google-oauth-credentials.json}"
DEST_DIR="$HOME/.config/mcp-google-gdrive"
DEST="$DEST_DIR/credentials.json"

if [[ ! -f "$SRC" ]]; then
  echo "Missing OAuth credentials: $SRC"
  echo ""
  echo "Google Cloud Console steps:"
  echo "  1. https://console.cloud.google.com/ → create project"
  echo "  2. Enable: Drive API, Docs API, Sheets API, Slides API"
  echo "  3. OAuth consent screen → External → add your Gmail as test user"
  echo "  4. Credentials → OAuth client ID → Desktop app → Download JSON"
  echo "  5. Save as: secrets/google-oauth-credentials.json"
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"
chmod 600 "$DEST"

echo "Installed credentials → $DEST"
echo ""
echo "Next, authorize your Google account:"
echo "  npx mcp-google-gdrive --auth primary"
echo ""
echo "Then reload Cursor so the google-gdrive MCP server connects."
