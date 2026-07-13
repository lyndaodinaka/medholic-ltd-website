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

function dataUri(relativePath, mimeType) {
  const filePath = path.join(root, relativePath);
  const encoded = fs.readFileSync(filePath).toString("base64");
  return `data:${mimeType};base64,${encoded}`;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const htmlPath = path.join(root, "marketing", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(path.join(root, "marketing", "marketing.css"), "utf8");
html = html
  .replace('<base href="/marketing/">', "")
  .replace('<link rel="stylesheet" href="marketing.css">', `<style>\n${css}\n</style>`)
  .replaceAll('/assets/favicon-32.png', dataUri(path.join("assets", "favicon-32.png"), "image/png"))
  .replaceAll('/assets/apple-touch-icon.png', dataUri(path.join("assets", "apple-touch-icon.png"), "image/png"))
  .replaceAll('/marketing/medholic-wordmark-logo.svg', dataUri(path.join("marketing", "medholic-wordmark-logo.svg"), "image/svg+xml"))
  .replaceAll('/marketing/medholic-luxury-boardroom.jpg', dataUri(path.join("marketing", "medholic-luxury-boardroom.jpg"), "image/jpeg"))
  .replaceAll('/marketing/spotit-logo.png', dataUri(path.join("marketing", "spotit-logo.png"), "image/png"))
  .replaceAll('/marketing/spotit-demo-nurse-capture.jpg', dataUri(path.join("marketing", "spotit-demo-nurse-capture.jpg"), "image/jpeg"))
  .replaceAll('/marketing/spotit-demo-phone-observation.jpg', dataUri(path.join("marketing", "spotit-demo-phone-observation.jpg"), "image/jpeg"))
  .replaceAll('/marketing/spotit-demo-doctor-review.jpg', dataUri(path.join("marketing", "spotit-demo-doctor-review.jpg"), "image/jpeg"))
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
  "icon-512.png"
]));
copyDir(path.join(root, "marketing"), path.join(dist, "marketing"), new Set([
  "medholic-wordmark-logo.svg",
  "medholic-luxury-boardroom.jpg",
  "spotit-logo.png",
  "spotit-demo-nurse-capture.jpg",
  "spotit-demo-phone-observation.jpg",
  "spotit-demo-doctor-review.jpg"
]));
copyFile(
  path.join(root, "docs", "final-business-launch-checklist.md"),
  path.join(dist, "docs", "final-business-launch-checklist.md")
);
copyFile(path.join(root, "site.webmanifest"), path.join(dist, "site.webmanifest"));
copyFile(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

fs.mkdirSync(serverDir, { recursive: true });
fs.writeFileSync(path.join(serverDir, "index.js"), `const html = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};
`);

console.log("Built Medholic public site in dist.");
