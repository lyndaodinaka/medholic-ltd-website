# Deploy Medholic Pharmacy With GitHub And Railway

For the shortest final launch checklist, also open `docs/live-launch-final-steps.md`.

## 1. Put The App On GitHub

1. Create a new GitHub repository, for example `medholic-pharmacy`.
2. Upload or push all files from this folder.
3. Make sure these files are included:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `server.js`
   - `package.json`
   - `railway.json`
   - `assets/`
   - `docs/`
   - `marketing/`

## 2. Connect Railway

1. Open Railway.
2. Create a new project.
3. Choose deploy from GitHub repo.
4. Select your Medholic Pharmacy repository.
5. Railway should detect the Node app and run `npm start`.

## 3. Check The Live App

After Railway finishes deploying:

1. Open the Railway generated domain.
2. Log in with:
   - Username: `nwaekpelynda1994@gmail.com`
   - Password: `MedholicAdmin2026!`
3. Test:
   - Capture medicine.
   - Generate stock code.
   - Record sale.
   - Download inventory report.
   - Download security report.
   - Open `/marketing/` and confirm the Medholic Pharmacy logo is visible.
4. Check the badge near the top of the app:
   - `Postgres live sync` means Railway Postgres is connected.
   - `Server file storage` means the server is running, but Postgres is not connected yet.
   - `Local browser only` means you opened the app as a file and data is saved only in that browser.
   - `Live sync offline` means the app cannot currently reach the server.

## 4. Shared Data Sync

The Railway version includes a starter backend API:

- `GET /api/state`
- `POST /api/state`
- `GET /api/backups`
- `GET /api/backups/:id`
- `POST /api/backups/:id/restore`

When the app is opened from Railway, it loads and saves shared data through this API. When opened directly as a local file, it still uses browser storage.

## 5. Add Railway Postgres

1. In your Railway project, click **New**.
2. Add **Postgres**.
3. Railway should automatically provide `DATABASE_URL` to your app service if they are in the same project.
4. Redeploy the app.
5. Open `/api/health` on your Railway domain.
6. Confirm it says `"storage":"postgres"`.
7. Confirm the app badge says `Postgres live sync`.

## Logo And Domain Preview

The app includes logo files for the domain and marketing page:

- Browser tab icon: `/assets/favicon-32.png`
- Phone icon: `/assets/apple-touch-icon.png`
- Social preview image: `/assets/medholic-og-image.png`
- Main transparent logo: `/assets/medholic-pharmacy-logo-transparent.png`
- Marketing page: `/marketing/`
- Printable flyer: `/marketing/flyer.html`

After Railway deploys, open your live domain, `/marketing/`, and `/marketing/flyer.html` to confirm the logo is showing.

If `DATABASE_URL` is not available, the app falls back to `data/medholic-state.json`.

## Backups

Before shared data is overwritten, the server keeps backup history:

- With Railway Postgres: backups are stored in `medholic_state_backups`.
- Without Postgres: backups are stored in `data/backups/`.

Inside the app, open **Security** and use:

- **Download Full Backup** to download all current pharmacy data as JSON.
- **View Backup History** to see saved server backups.
- **Download** beside a backup to keep a copy of that older backup.
- **Restore** beside a backup to replace current shared records with that backup.

Restore is manager-only. The app asks you to type `RESTORE` before replacing data, and the server backs up the current data before restoring the selected backup.

## 6. Set Login Environment Variables

In Railway variables, set:

- `ADMIN_EMAIL=nwaekpelynda1994@gmail.com`
- `ADMIN_PASSWORD=MedholicAdmin2026!`

The app includes these defaults, but setting them in Railway variables is better because you can change them without editing code.

### Safer Password Option

For better security, use `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.

Generate a password hash locally:

```powershell
npm run make-password-hash -- "MedholicAdmin2026!"
```

Copy the output into Railway variables:

```text
ADMIN_PASSWORD_HASH=pbkdf2:...
```

Then remove `ADMIN_PASSWORD` from Railway variables. The server will prefer `ADMIN_PASSWORD_HASH` when it exists.

### Add More Staff Accounts

You can add cashier, pharmacist, or inventory staff accounts with one Railway variable:

```text
STAFF_ACCOUNTS_JSON=[
  {
    "username": "cashier@example.com",
    "passwordHash": "pbkdf2:...",
    "name": "Cashier One",
    "role": "Cashier"
  },
  {
    "username": "pharmacist@example.com",
    "passwordHash": "pbkdf2:...",
    "name": "Pharmacist One",
    "role": "Pharmacist"
  }
]
```

Generate each `passwordHash` with:

```powershell
npm run make-password-hash -- "staff-password-here"
```

Keep the JSON on one line when entering it into Railway variables.

## 7. Custom Domain

In Railway project settings, add your custom domain and follow Railway's DNS instructions.

## Important Live Warning

This version now supports Railway Postgres, but it still uses a simple whole-app data document. For full production use, the next upgrade should split records into separate database tables with server-side user permissions, secure password hashing, and role-based access.

Recommended production upgrade:

- Railway backend database.
- Secure server login.
- Real password reset by email.
- Server-side audit logs.
- Daily backups.
- Staff roles and permissions.
