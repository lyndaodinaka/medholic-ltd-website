# Medholic Pharmacy Final Business Launch Checklist

Use this before sharing Medholic publicly with pharmacies, buyers, or investors.

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
```

Do not show the manager password in GitHub, screenshots, marketing pages, or public documents.

## 3. Test The App

- Log in as manager.
- Add a test medicine.
- Add a test sale.
- Check low-stock alert.
- Check expiry report.
- Download inventory report.
- Open Security.
- View access requests.
- Change a lead status.
- Add a lead follow-up date.
- Add a private lead note.
- Sign out.

## 4. Test The Marketing Flow

- Open `marketing/index.html`.
- Open `marketing/flyer.html`.
- Open `marketing/proposal.html`.
- Open `marketing/pricing-calculator.html`.
- Click an enquiry email button.
- Confirm the email opens to `lynda.chidi@medholic.net`.

## 5. Prepare Sales Materials

Use:

- `docs/customer-sales-script.md`
- `docs/live-demo-checklist.md`
- `docs/follow-up-email-templates.md`
- `docs/quote-template.md`
- `docs/invoice-template.md`
- `docs/service-agreement-template.md`

## 6. When Someone Requests A Demo

- Open Security.
- Click View Access Requests.
- Set status to Contacted.
- Send a demo follow-up email.
- If they agree to a demo, set status to Demo booked.
- After pricing is sent, set status to Quoted.
- If they pay or agree, set status to Won.

## 7. When A Lead Becomes Won

Use:

- `docs/won-lead-next-steps.md`
- `docs/customer-onboarding-checklist.md`
- `docs/invoice-template.md`
- `docs/service-agreement-template.md`

## 8. Mobile App / Play Store

- Upload the mobile-ready files first.
- Keep the Railway app live on HTTPS.
- Use `mobile/twa-manifest.json` to generate the Android app bundle.
- Replace the placeholder in `.well-known/assetlinks.json` after Google Play gives the certificate fingerprint.
- Upload the `.aab` to Google Play Console.

## 9. Best First Sales Target

Start with:

- Small pharmacies.
- Medicine stores.
- Clinics with medicine stock.
- Pharmacies still using notebooks or Excel.

Offer setup and training as a paid service.
