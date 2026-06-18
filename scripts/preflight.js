const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "index.html",
  "app.js",
  "styles.css",
  "server.js",
  "package.json",
  "railway.json",
  "site.webmanifest",
  "assets/medholic-pharmacy-logo-transparent.png",
  "assets/favicon-32.png",
  "assets/apple-touch-icon.png",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/medholic-og-image.png",
  "marketing/index.html",
  "marketing/flyer.html",
  "marketing/marketing.css",
  "docs/railway-github-deployment.md",
  "docs/production-readiness-checklist.md",
  "docs/barcode-scanning-guide.md",
  "docs/access-request-guide.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

function parseJson(file) {
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

try {
  parseJson("package.json");
  parseJson("railway.json");
  parseJson("site.webmanifest");
} catch (error) {
  console.error(`Invalid JSON: ${error.message}`);
  process.exit(1);
}

if (missing.length) {
  console.error("Missing required live files:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("Medholic Pharmacy preflight passed.");
