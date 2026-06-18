# Medholic Pharmacy Production Readiness Checklist

Use this before you start entering real pharmacy stock, real sales, or staff records.

## 1. GitHub

- Create a private GitHub repository for Medholic Pharmacy.
- Upload all app files from this folder.
- Do not upload `.env`, `node_modules`, `.zip` packages, or `data/medholic-state.json`.
- Keep `.gitignore` in the repository.

## 2. Railway

- Create a Railway project from the GitHub repository.
- Add a Railway Postgres database.
- Confirm the app service has `DATABASE_URL`.
- Open `/api/health` on the live domain.
- Confirm it shows `"storage":"postgres"`.
- Confirm the app badge says `Postgres live sync`.
- Do not enter real live stock while the badge says `Local browser only` or `Live sync offline`.

## 3. Login Security

- Keep manager email as `nwaekpelynda1994@gmail.com`.
- Keep manager password as `MedholicAdmin2026!` unless you intentionally change it.
- Prefer `ADMIN_PASSWORD_HASH` in Railway instead of plain `ADMIN_PASSWORD`.
- Remove staff accounts immediately when a staff member leaves.
- Use different staff logins for cashier, pharmacist, inventory clerk, and manager.

## 4. Daily Pharmacy Routine

- Capture every medicine or item when stock arrives.
- Use generated stock codes when there is no barcode.
- For counter sales, use a USB barcode scanner with the laptop/desktop where possible.
- For shelf checks, use a phone camera or laptop/desktop webcam where convenient.
- Enter expiry dates for medicines and medical supplies.
- Enter supplier phone/email once, then choose the saved supplier next time.
- Record every sale through the sales screen.
- For controlled/opioid medicines, enter the doctor report or prescription reference before sale.
- Open **Reports** and use **Reorder list** to see low-stock items with saved supplier contacts.
- Download **Reorder Report** before placing supplier orders.
- Download **Purchase Order** when you want a supplier-grouped order note.
- Download the security report at closing time.

## 5. Theft And Loss Tracing

- Use the cash drawer check at opening and closing.
- Use stock count adjustment whenever physical stock does not match system stock.
- Check the security report for deleted items, edited stock, high-risk sales, missing stock, and cash differences.
- Keep the full backup download at least weekly.
- Use Backup History only when you need to inspect or restore older server data.
- Before restoring a backup, download the current full backup first.
- Restoring a backup replaces the current shared records, so only the manager should do it.

## 6. Expiry And Stock Alerts

- Check expired items every day before selling.
- Check items expiring within 90 days every week.
- Reorder low-stock items before they reach zero.
- Use saved supplier email/phone actions from the reorder list where possible.
- Remove expired medicines from sale and follow your local disposal rules.

## 7. Legal And Clinical Safety

- Confirm local pharmacy regulations before live use.
- Controlled medicines should only be sold under the correct legal and pharmacist-approved process.
- Recommended doses in the app are reminders only; final dosing should come from prescription, product label, local protocol, or pharmacist approval.

## 8. Next Production Upgrade

This version supports Railway Postgres, login, reports, backups, and audit logs. The strongest next upgrade is to split the one shared data document into separate database tables for medicines, sales, staff, suppliers, stock movements, and audit logs, with server-side permissions for every action.
