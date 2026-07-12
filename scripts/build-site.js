const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(from, to, allowList = null) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(source, target, allowList);
      continue;
    }
    if (!allowList || allowList.has(entry.name)) {
      copyFile(source, target);
    }
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const htmlPath = path.join(root, "marketing", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
html = html
  .replace('<base href="/marketing/">', "")
  .replaceAll('href="/assets/', 'href="assets/')
  .replaceAll('src="/assets/', 'src="assets/')
  .replaceAll('content="/marketing/', 'content="marketing/')
  .replaceAll('src="/marketing/', 'src="marketing/')
  .replaceAll('href="/app"', 'href="#work"')
  .replaceAll('href="/docs/final-business-launch-checklist.md"', 'href="docs/final-business-launch-checklist.md"');

fs.writeFileSync(path.join(dist, "index.html"), html);
copyFile(path.join(root, "marketing", "marketing.css"), path.join(dist, "marketing.css"));
copyDir(path.join(root, "assets"), path.join(dist, "assets"), new Set([
  "apple-touch-icon.png",
  "favicon-32.png",
  "icon-192.png",
  "icon-512.png",
  "medholic-logo-transparent.png"
]));
copyDir(path.join(root, "marketing"), path.join(dist, "marketing"), new Set([
  "lynda-checking-system.png",
  "lynda-counting-medication.png",
  "lynda-presenting-medication.png"
]));
copyFile(
  path.join(root, "docs", "final-business-launch-checklist.md"),
  path.join(dist, "docs", "final-business-launch-checklist.md")
);
copyFile(path.join(root, "site.webmanifest"), path.join(dist, "site.webmanifest"));
copyFile(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

fs.mkdirSync(serverDir, { recursive: true });
fs.writeFileSync(path.join(serverDir, "index.js"), `const fs = require("fs");
const path = require("path");
const http = require("http");

const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".md": "text/markdown; charset=utf-8"
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(String(urlPath || "/").split("?")[0]);
  const relative = clean === "/" ? "index.html" : clean.replace(/^\\/+/, "");
  const filePath = path.resolve(root, relative);
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function sendFile(request, response) {
  const filePath = resolveFile(request.url);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
  response.end(fs.readFileSync(filePath));
}

exports.default = function handler(request, response) {
  return sendFile(request, response);
};

exports.handler = exports.default;

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  http.createServer(sendFile).listen(port, () => {
    console.log("Medholic public site running on port " + port);
  });
}
`);

console.log("Built Medholic public site in dist.");
