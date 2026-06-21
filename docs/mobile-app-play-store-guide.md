# Medholic Pharmacy Mobile App And Play Store Guide

This prepares Medholic Pharmacy for Android installation and Google Play release.

## What Is Ready In The App

- App name: Medholic Pharmacy
- Package name: `net.medholic.pharmacy`
- Public web app domain: `https://medholicpharmacy.up.railway.app`
- App icon assets are already in `assets/`
- Web app manifest is already linked in the app
- Service worker file added at `sw.js` so Android can install the app like a mobile app
- Trusted Web Activity config added at `mobile/twa-manifest.json`
- Digital Asset Links placeholder added at `.well-known/assetlinks.json`

## Important Before Play Store Upload

Google Play needs an Android App Bundle file (`.aab`). A website alone cannot be uploaded directly to Play Store.

The usual route for a web app like Medholic Pharmacy is:

1. Keep the Railway website live on HTTPS.
2. Wrap the website as an Android Trusted Web Activity.
3. Generate a signed `.aab`.
4. Upload the `.aab` to Google Play Console.
5. Complete the Play Store listing, privacy, data safety, and testing requirements.

## Private Login

Keep manager login details only in Railway Variables:

```text
ADMIN_EMAIL=your private manager email
ADMIN_PASSWORD=your private manager password
```

Do not write the manager password into public app files, GitHub, screenshots, flyers, or Play Store text.

## Play Store Listing Draft

App name:

```text
Medholic Pharmacy
```

Short description:

```text
Pharmacy stock, sales, expiry, supplier, and security tracking.
```

Full description:

```text
Medholic Pharmacy helps pharmacy teams manage medicine inventory, sales, expiry alerts, suppliers, reorder reports, employee rosters, and security tracing from one clean dashboard.

The app supports barcode or generated stock-code capture, low-stock alerts, expiry warnings, sales records, gain reports, supplier contacts, purchase-order support, controlled medicine checks, and downloadable reports.

Built for pharmacies, medicine stores, clinics, and inventory teams that need clearer daily stock control and accountability.
```

Support email:

```text
lynda.chidi@medholic.net
```

Category:

```text
Business
```

## Files For Android Developer

Give these files to whoever builds the Android wrapper:

- `mobile/twa-manifest.json`
- `site.webmanifest`
- `.well-known/assetlinks.json`
- `assets/icon-512.png`
- `assets/icon-192.png`
- `assets/medholic-pharmacy-logo-transparent.png`

## Digital Asset Links Step

After the Android `.aab` is signed, Google Play gives a SHA-256 app signing certificate fingerprint.

Replace this placeholder in `.well-known/assetlinks.json`:

```text
REPLACE_WITH_GOOGLE_PLAY_APP_SIGNING_SHA256_CERTIFICATE_FINGERPRINT
```

Then upload the updated file to GitHub/Railway and redeploy.

## What You Must Do In Google Play Console

1. Create a Google Play Developer account.
2. Create app: Medholic Pharmacy.
3. Choose app, not game.
4. Choose free or paid.
5. Add support email: `lynda.chidi@medholic.net`.
6. Upload the signed `.aab`.
7. Complete store listing, screenshots, privacy policy, data safety, app access, and content rating.
8. Complete testing requirements if Google asks for closed testing.
9. Submit for review.

## Notes

- Google Play package names are permanent. Keep `net.medholic.pharmacy` unless you are certain you want another package name.
- Every future app upload needs a higher version code: `1`, then `2`, then `3`, and so on.
- The phone app will open the live Railway website inside a proper Android app window.
