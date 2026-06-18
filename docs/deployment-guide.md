# Medholic Pharmacy Deployment Guide

## Fastest Static Hosting Options

### Netlify

1. Create a Netlify account.
2. Drag the `MedholicPharmacy-live-package` folder or zip into Netlify Drop.
3. Netlify will provide a live URL.
4. Add your custom domain in Netlify domain settings.

### Vercel

1. Create a Vercel account.
2. Import/upload the project folder.
3. Use the included `vercel.json`.
4. Add your custom domain in Vercel project settings.

### Any cPanel / Shared Hosting

1. Open your hosting file manager.
2. Upload all files in this folder into `public_html`.
3. Make sure `index.html`, `app.js`, `styles.css`, and `assets/` are in the same web folder.

## Important Before Real Pharmacy Use

This version stores records in the browser. For live business use, build a backend with:

- Secure user accounts and password reset.
- Database storage for inventory, sales, audit logs, suppliers, and cash checks.
- Role permissions for manager, cashier, pharmacist, and inventory staff.
- Server-side audit logs that staff cannot erase.
- Backups.
- HTTPS.

## Suggested Live Hosting Path

Use this prototype for demo/testing first. Then build a secure production backend before using it for real patient, staff, financial, or controlled-medicine records.

