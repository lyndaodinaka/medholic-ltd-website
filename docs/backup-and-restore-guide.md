# Medholic Pharmacy Backup And Restore Guide

## Download Current Backup

1. Log in as the manager.
2. Open **Security**.
3. Click **Download Full Backup**.
4. Keep the downloaded JSON file somewhere private and safe.

This is the best routine backup for daily or weekly use.

## View Server Backup History

1. Open **Security**.
2. Click **View Backup History**.
3. Click **Refresh** if the list does not appear.

Backup history works when the app is running on Railway or the local server. If you open `index.html` directly as a file, use **Download Full Backup** instead.

## Download An Older Backup

1. Open **View Backup History**.
2. Find the backup date.
3. Click **Download** beside that backup.

This downloads that older backup without changing your current records.

## Restore An Older Backup

1. Open **View Backup History**.
2. Find the backup you want.
3. Click **Restore**.
4. Type `RESTORE` when asked.

Restoring replaces the current shared records. The server makes a backup of the current records first, then restores the older backup. A high-risk audit log is added so you can trace who restored it.

## When To Restore

Restore only when records were badly overwritten, deleted by mistake, or corrupted. For normal reporting, use **Download Full Backup**, **Download Inventory Report**, and **Download Security Report** instead.
