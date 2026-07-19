#!/usr/bin/env python3
"""
Google Drive OAuth login + upload TMC ring catalog.

Setup (one time):
  1. https://console.cloud.google.com/ → create/select project
  2. Enable APIs: Google Drive API, Google Sheets API
  3. OAuth consent screen → External → add your Gmail as test user
  4. Credentials → Create OAuth client ID → Desktop app
  5. Download JSON → save as: secrets/google-oauth-credentials.json

Commands:
  python3 scripts/upload_tmc_catalog_to_drive.py login
  python3 scripts/upload_tmc_catalog_to_drive.py upload
  python3 scripts/upload_tmc_catalog_to_drive.py upload --folder-id YOUR_SHARED_FOLDER_ID

The login command opens your browser. After you approve, a token is saved locally
for future uploads (secrets/google-drive-token.json).
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECRETS_DIR = ROOT / "secrets"
CREDENTIALS_PATH = SECRETS_DIR / "google-oauth-credentials.json"
TOKEN_PATH = SECRETS_DIR / "google-drive-token.json"
CATALOG_DIR = ROOT / "exports/tmc-ring-catalog"

SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
]


def require_google_libs():
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        return Request, Credentials, InstalledAppFlow, build, MediaFileUpload
    except ImportError:
        print("Missing Google libraries. Run:")
        print("  pip3 install google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        sys.exit(1)


def get_credentials():
    Request, Credentials, InstalledAppFlow, _, _ = require_google_libs()

    if not CREDENTIALS_PATH.exists():
        print(f"\nMissing OAuth credentials file:\n  {CREDENTIALS_PATH}\n")
        print("Follow the setup steps at the top of this script, then run login again.")
        sys.exit(1)

    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_PATH.write_text(creds.to_json())
        return creds

    if creds and creds.valid:
        return creds

    # Need interactive login
    flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
    print("\nOpening browser for Google sign-in...")
    print("If the browser does not open, copy the URL from the terminal.\n")
    creds = flow.run_local_server(port=0, open_browser=True)
    SECRETS_DIR.mkdir(parents=True, exist_ok=True)
    TOKEN_PATH.write_text(creds.to_json())
    print(f"\nLogged in. Token saved to:\n  {TOKEN_PATH}\n")
    return creds


def cmd_login():
    get_credentials()
    print("Google Drive OAuth login successful.")


def find_or_create_folder(service, name: str, parent_id: str | None = None) -> str:
    q = f"name = '{name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    if parent_id:
        q += f" and '{parent_id}' in parents"
    else:
        q += " and 'root' in parents"

    res = service.files().list(
        q=q,
        fields="files(id, name)",
        pageSize=1,
        supportsAllDrives=True,
        includeItemsFromAllDrives=True,
    ).execute()
    files = res.get("files", [])
    if files:
        return files[0]["id"]

    meta = {"name": name, "mimeType": "application/vnd.google-apps.folder"}
    if parent_id:
        meta["parents"] = [parent_id]
    created = service.files().create(body=meta, fields="id", supportsAllDrives=True).execute()
    return created["id"]


def upload_file(service, MediaFileUpload, local_path: Path, parent_id: str, drive_name: str | None = None):
    mime, _ = mimetypes.guess_type(str(local_path))
    meta = {"name": drive_name or local_path.name, "parents": [parent_id]}
    media = MediaFileUpload(str(local_path), mimetype=mime or "application/octet-stream", resumable=True)
    return service.files().create(
        body=meta, media_body=media, fields="id, webViewLink", supportsAllDrives=True
    ).execute()


def upload_csv_as_sheet(service, MediaFileUpload, local_path: Path, parent_id: str, sheet_name: str):
    """Upload a CSV and let Drive convert it to a native Google Sheet."""
    meta = {
        "name": sheet_name,
        "parents": [parent_id],
        "mimeType": "application/vnd.google-apps.spreadsheet",
    }
    media = MediaFileUpload(str(local_path), mimetype="text/csv", resumable=True)
    return service.files().create(
        body=meta, media_body=media, fields="id, webViewLink", supportsAllDrives=True
    ).execute()


def cmd_upload(folder_id: str | None):
    _, _, _, build, MediaFileUpload = require_google_libs()
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)

    if not CATALOG_DIR.exists():
        print(f"Missing catalog folder: {CATALOG_DIR}")
        print("Run: node scripts/scrape-tmc-ring-catalog.mjs")
        sys.exit(1)

    # Target folder on Drive
    if folder_id:
        parent_id = folder_id
        print(f"Uploading into shared folder: {folder_id}")
    else:
        parent_id = find_or_create_folder(service, "TMC Ring Catalog - ELYSIUM")
        print(f"Created/using Drive folder: TMC Ring Catalog - ELYSIUM")

    images_parent = find_or_create_folder(service, "images", parent_id)

    # Upload spreadsheet files to root catalog folder
    for fname in ["TMC_Ring_Catalog_Client.xlsx", "TMC_Ring_Catalog_Client.csv", "catalog.json"]:
        fpath = CATALOG_DIR / fname
        if fpath.exists():
            result = upload_file(service, MediaFileUpload, fpath, parent_id)
            print(f"  uploaded {fname} → {result.get('webViewLink', result['id'])}")

    # Create a native Google Sheet from the CSV
    csv_path = CATALOG_DIR / "TMC_Ring_Catalog_Client.csv"
    sheet_link = None
    if csv_path.exists():
        sheet = upload_csv_as_sheet(
            service, MediaFileUpload, csv_path, parent_id, "TMC Ring Catalog — Client Review"
        )
        sheet_link = sheet.get("webViewLink", sheet["id"])
        print(f"  created Google Sheet → {sheet_link}")

    # Upload images preserving handle subfolders
    images_dir = CATALOG_DIR / "images"
    image_files = sorted(images_dir.rglob("*"))
    image_files = [p for p in image_files if p.is_file()]

    print(f"\nUploading {len(image_files)} images...")
    handle_folder_cache: dict[str, str] = {}

    for i, img in enumerate(image_files, 1):
        handle = img.parent.name
        if handle not in handle_folder_cache:
            handle_folder_cache[handle] = find_or_create_folder(service, handle, images_parent)

        dest_folder = handle_folder_cache[handle]
        upload_file(service, MediaFileUpload, img, dest_folder)
        if i % 50 == 0 or i == len(image_files):
            print(f"  {i}/{len(image_files)}")

    # Print folder link
    folder_meta = service.files().get(
        fileId=parent_id, fields="webViewLink", supportsAllDrives=True
    ).execute()
    print(f"\nDone. Uploaded {len(image_files)} images.")
    print(f"Catalog folder:\n  {folder_meta.get('webViewLink')}")
    if sheet_link:
        print(f"Google Sheet:\n  {sheet_link}")


def main():
    parser = argparse.ArgumentParser(description="Google Drive OAuth + TMC catalog upload")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("login", help="Sign in with Google (opens browser)")

    up = sub.add_parser("upload", help="Upload catalog to Google Drive")
    up.add_argument(
        "--folder-id",
        help="Optional shared Drive folder ID (from folder URL)",
    )

    args = parser.parse_args()

    if args.command == "login":
        cmd_login()
    elif args.command == "upload":
        cmd_upload(args.folder_id)


if __name__ == "__main__":
    main()
