# Medholic Pharmacy Final Business Launch Checklist

Use this before entering real Medholic Pharmacy stock and sales.

## 1. Upload Latest Files

- Upload the latest package contents to GitHub.
- Confirm Railway redeploys successfully.
- Open the live Railway link.
- Confirm the logo appears on the app and marketing page.

## 2. Confirm Private Login

In Railway Variables, keep:

```text
ADMIN_EMAIL=your private manager email
ADMIN_PASSWORD=your private manager password
ADMIN_NAME=Lynda Chidi
```

Do not show the manager password in GitHub, screenshots, marketing pages, or public documents.

## 3. Test The App

- Log in as manager.
- Confirm the user label says `Lynda Chidi - Manager`.
- Add a test medicine.
- Add a test sale.
- Check low-stock alert.
- Check expiry report.
- Download inventory report.
- Open Security.
- Save a cash drawer check.
- Save a stock count adjustment.
- Download a security report.
- Sign out.

## 4. Test The Private Brand Pages

- Open `marketing/index.html`.
- Open `marketing/flyer.html`.

## 5. Prepare Internal Materials

Use:

- `docs/invoice-template.md`

## 6. Mobile App / Play Store

- Upload the mobile-ready files first.
- Keep the Railway app live on HTTPS.
- Use `mobile/twa-manifest.json` to generate the Android app bundle.
- Replace the placeholder in `.well-known/assetlinks.json` after Google Play gives the certificate fingerprint.
- Upload the `.aab` to Google Play Console.
