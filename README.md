# Medholic Pharmacy

Medholic Pharmacy is a pharmacy inventory, sales, supplier, staff roster, reporting, and security-audit web app.

![Medholic Pharmacy logo](assets/medholic-pharmacy-logo-transparent.png)

## What It Does

- Captures medicines by barcode or generated stock code.
- Supports phone camera, laptop/desktop webcam, USB barcode scanner, manual entry, or generated stock code.
- Tracks quantity received, sold, and left.
- Shows low-stock and expiry alerts.
- Records sales by seller and payment method.
- Requires doctor report or prescription reference before selling controlled/opioid medicines.
- Saves supplier phone/email for reuse.
- Shows a reorder list for low-stock items with supplier email/phone actions.
- Downloads a supplier-grouped purchase order for low-stock items.
- Produces inventory and security reports.
- Records audit events for sales, stock changes, deletions, cash checks, and missing stock.
- Includes an in-app Help section with launch, marketing, backup, and live-sync guidance.
- Includes buyer/investor access requests from the sign-in page.

## Login

The manager login should be kept private and entered only on the sign-in page.

## Local Use

Open `index.html` in a browser, or run:

```powershell
.\start-pharma-local.bat
```

Then open:

```text
http://127.0.0.1:4177
```

## Railway / Live Use

The app can run locally or on Railway. When deployed with Railway and Postgres, shared inventory, sales, staff, supplier, report, and security data are saved through the server instead of only in the browser.

The badge near the top of the app shows where data is saving:

- `Postgres live sync`: Railway Postgres is connected.
- `Server file storage`: the server is running without Postgres.
- `Local browser only`: data is only in that browser.
- `Live sync offline`: the app cannot reach the server.

For Railway setup, open:

- `docs/railway-github-deployment.md`
- `docs/production-readiness-checklist.md`
- `docs/live-launch-final-steps.md`
- `docs/login-design-guide.md`
- `docs/barcode-scanning-guide.md`
- `docs/access-request-guide.md`

Marketing page:

- `/marketing/` on your live domain

Important: keep the manager login private. Do not display the manager email or password on public pages.
