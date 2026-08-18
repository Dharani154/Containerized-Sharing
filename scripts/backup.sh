#!/bin/bash

BACKUP_DIR="$HOME/sharebox-backups"

DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

echo "Starting ShareBox backup..."

docker run --rm \
  -v sharebox-data:/source:ro \
  -v "$BACKUP_DIR":/backup \
  alpine \
  tar czf "/backup/sharebox-$DATE.tar.gz" \
  -C /source .

echo "Backup completed."

echo "Backup location:"
echo "$BACKUP_DIR"

ls -lh "$BACKUP_DIR"
