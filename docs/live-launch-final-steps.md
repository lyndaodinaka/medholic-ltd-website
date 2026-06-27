# Medholic Pharmacy Live Launch Final Steps

Use this when you are ready to put the app on GitHub and Railway.

## 1. Check The App Before Upload

Run this inside the `PharmaInventoryApp` folder:

```powershell
npm run check
npm run preflight
```

Both commands should pass before uploading.

## 2. Upload To GitHub

```powershell
git init
git add .
git commit -m "Launch Medholic Pharmacy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
git push -u origin main
```

## 3. Deploy On Railway

1. Open Railway.
2. Create a new project.
3. Choose **Deploy from GitHub repo**.
4. Select the Medholic Pharmacy repository.
5. Add Railway Postgres.
6. Confirm `DATABASE_URL` is available in the app service.
7. Set these variables:

```text
ADMIN_EMAIL=your-manager-email@example.com
ADMIN_PASSWORD=your-manager-password
```

8. Deploy.

## 4. Confirm The Live App

Open the Railway domain and log in:

```text
Username: your manager email
Password: your manager password
```

Then check:

- `/api/health` shows `"storage":"postgres"`.
- The app badge says `Postgres live sync`.
- The logo appears on the login screen.
- The sign-in page shows only the private Medholic login.
- `/marketing/` opens and shows the logo.
- `/marketing/flyer.html` opens and shows the flyer.
- Reports download correctly.
- Backup download works from Security.

## 5. Your Live Login Link

Your login link will be the Railway domain or your custom domain, for example:

```text
https://your-medholic-pharmacy-domain.up.railway.app
```

Railway shows the exact link after deployment.
