# Medholic Pharmacy Google Play Submit Next Steps

This is the practical checklist for listing Medholic Pharmacy on Google Play.

## What Is Already Prepared

- Live web app files.
- App manifest: `site.webmanifest`
- Service worker: `sw.js`
- Android Trusted Web Activity settings: `mobile/twa-manifest.json`
- Play Store listing draft: `mobile/play-store-listing.md`
- Play Store guide: `docs/mobile-app-play-store-guide.md`
- Asset links placeholder: `.well-known/assetlinks.json`

## What Is Still Needed

Google Play needs an Android App Bundle file:

```text
.aab
```

The website zip cannot be uploaded directly as the Play Store app. The web app must be wrapped as an Android Trusted Web Activity or Android app, then exported as a signed `.aab`.

## Recommended Route

Use a Trusted Web Activity wrapper because Medholic is already a live web app.

The Android wrapper should use:

```text
Package name: net.medholic.pharmacy
Start URL: https://medholicpharmacy.up.railway.app/
App name: Medholic Pharmacy
Support email: lynda.chidi@medholic.net
```

## Play Console Steps

1. Open Google Play Console.
2. Create app.
3. App name: Medholic Pharmacy.
4. Type: App.
5. Free or paid: choose how you want to publish.
6. Support email: `lynda.chidi@medholic.net`.
7. Accept required declarations.
8. Complete app dashboard tasks.
9. Upload the signed `.aab`.
10. Complete store listing.
11. Complete privacy policy and data safety.
12. Complete content rating.
13. Complete app access/login instructions for Google reviewers.
14. Run required testing if Google asks.
15. Submit for review.

## Testing Requirement Notice

If your Google Play developer account is a personal account created after November 13, 2023, Google may require closed testing with at least 12 testers opted in for 14 continuous days before production release.

## Store Listing Draft

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

## App Access For Google Review

Give Google a demo login, not your personal private manager login.

Create a safe reviewer account in Railway Variables or staff JSON before submission.

Example:

```text
Reviewer email: reviewer@medholic.net
Reviewer password: temporary review password
```

After Google approves the app, change or remove the reviewer password.

## Important

Do not put your private admin password in the store listing, screenshots, GitHub, or public pages.
