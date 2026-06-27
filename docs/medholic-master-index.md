# Medholic Pharmacy Master Index

Use this as the main map for your private Medholic Pharmacy app, brand, mobile app, deployment, and backup files.

## Live App Files

- `index.html` - main Medholic Pharmacy app.
- `app.js` - app logic, inventory, sales, reports, security, backups, and UI actions.
- `server.js` - Railway server, login, database sync, backups, and private app routes.
- `styles.css` - app design.
- `site.webmanifest` - installable app settings.
- `sw.js` - mobile install/service worker support.

The app Help section contains quick links to the private brand page, flyer, launch checklist, deployment guide, backup guide, barcode guide, and login design notes.

## Marketing Pages

- `marketing/index.html` - main marketing page.
- `marketing/flyer.html` - printable flyer.
- `marketing/medholic-safe-marketing-photo-official-logo.png` - safe brand photo with logo.

## Internal Documents

- `docs/invoice-template.md` - invoice template.

## Setup And Maintenance

- `docs/final-handoff-notes.md` - final upload, test, and daily workflow notes.
- `docs/final-release-receipt.md` - checksum and upload record for the final package.
- `docs/release-notes.md` - summary of the final business launch version.
- `docs/backup-and-restore-guide.md` - backup and restore notes.
- `docs/security-and-live-use.md` - security and live-use guidance.

## Deployment And Mobile App

- `docs/railway-github-deployment.md` - Railway and GitHub deployment guide.
- `docs/live-launch-final-steps.md` - final live launch steps.
- `docs/mobile-app-play-store-guide.md` - Android/Play Store path.
- `docs/google-play-submit-next-steps.md` - exact next steps for Google Play listing.
- `mobile/twa-manifest.json` - Android Trusted Web Activity wrapper settings.
- `.well-known/assetlinks.json` - Play Store asset links placeholder.

Keep manager login details private in Railway Variables only.

For the live manager display name, set:

```text
ADMIN_NAME=Lynda Chidi
```
