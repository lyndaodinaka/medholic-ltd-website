# Security And Live Use Notes

## Current App Security

The app now supports shared storage through Railway Postgres when `DATABASE_URL` is available. When hosted on Railway, login is checked by the server and shared data API calls require a session token.

## For Real Use

Before using Medholic Pharmacy for live operations, add:

- Separate database tables for medicines, sales, suppliers, users, and audit logs.
- Encrypted/hashed passwords.
- `ADMIN_PASSWORD_HASH` is supported for the current manager login.
- Extra staff accounts are supported through `STAFF_ACCOUNTS_JSON`.
- Password reset by email.
- Long-term session management.
- Manager-only audit exports.
- Daily backups.
- Server keeps recent backup history before shared data is overwritten.
- Staff roles.
- Immutable audit logs.
- Controlled-medicine reporting.
- Cash drawer reconciliation by shift.

## Theft And Loss Tracing Features Included

- Sales are linked to seller name.
- Payment method is recorded.
- Cash drawer check compares expected cash against counted cash.
- Stock check compares expected shelf quantity against counted quantity.
- Missing stock creates high-risk audit events.
- Deletions are logged as high-risk events.
- Controlled/opioid medicine sales require doctor report or prescription reference.

## Role-Based Access Included

- Manager: full access.
- Pharmacist: dashboard, capture, inventory, sales, reports.
- Cashier: dashboard and sales.
- Inventory clerk: dashboard, capture, inventory, reports.

Manager-only actions include security reports, full backups, cash drawer checks, stock audit adjustments, staff management, deleting inventory records, and adding sample data.
