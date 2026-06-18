# GitHub Upload Commands

Run these inside the `PharmaInventoryApp` folder after you create a new GitHub repository.

```powershell
git init
git add .
git commit -m "Initial Medholic Pharmacy app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
git push -u origin main
```

After pushing, connect the repository to Railway and deploy from GitHub.

Before pushing future updates:

```powershell
npm run check
git add .
git commit -m "Update Medholic Pharmacy"
git push
```

Do not commit private files such as `.env`, exported backups, or real pharmacy data files.
