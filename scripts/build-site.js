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

function fileBase64(relativePath) {
  return fs.readFileSync(path.join(root, relativePath)).toString("base64");
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const css = fs.readFileSync(path.join(root, "marketing", "marketing.css"), "utf8");
function prepareMarketingHtml(fileName) {
  return fs.readFileSync(path.join(root, "marketing", fileName), "utf8")
    .replace('<base href="/marketing/">', "")
    .replace('<link rel="stylesheet" href="marketing.css">', `<style>\n${css}\n</style>`)
    .replaceAll('/assets/favicon-32.png', dataUri(path.join("assets", "favicon-32.png"), "image/png"))
    .replaceAll('/assets/apple-touch-icon.png', dataUri(path.join("assets", "apple-touch-icon.png"), "image/png"))
    .replaceAll('src="/marketing/medholic-wordmark-logo-warm.png"', `src="${dataUri(path.join("marketing", "medholic-wordmark-logo-warm.png"), "image/png")}"`)
    .replaceAll('src="/marketing/medholic-branded-preview.jpg"', `src="${dataUri(path.join("marketing", "medholic-branded-preview.jpg"), "image/jpeg")}"`)
    .replaceAll('src="/marketing/medholic-luxury-boardroom.jpg"', `src="${dataUri(path.join("marketing", "medholic-luxury-boardroom.jpg"), "image/jpeg")}"`)
    .replaceAll('src="/marketing/spotit-logo-warm.png"', `src="${dataUri(path.join("marketing", "spotit-logo-warm.png"), "image/png")}"`)
    .replaceAll('src="/marketing/spotit-flyer-man-private.jpg"', `src="${dataUri(path.join("marketing", "spotit-flyer-man-private.jpg"), "image/jpeg")}"`)
    .replaceAll('src="/marketing/spotit-flyer-female-private.jpg"', `src="${dataUri(path.join("marketing", "spotit-flyer-female-private.jpg"), "image/jpeg")}"`)
    .replaceAll('href="/assets/', 'href="assets/')
    .replaceAll('src="/assets/', 'src="assets/')
    .replaceAll('href="/app"', 'href="#work"')
    .replaceAll('href="/docs/final-business-launch-checklist.md"', 'href="docs/final-business-launch-checklist.md"');
}

const html = prepareMarketingHtml("index.html");
const spotitHtml = prepareMarketingHtml("spotit.html");

fs.writeFileSync(path.join(dist, "index.html"), html);
fs.mkdirSync(path.join(dist, "spotit"), { recursive: true });
fs.writeFileSync(path.join(dist, "spotit", "index.html"), spotitHtml);
copyFile(path.join(root, "marketing", "marketing.css"), path.join(dist, "marketing.css"));
copyDir(path.join(root, "assets"), path.join(dist, "assets"), new Set([
  "apple-touch-icon.png",
  "favicon.ico",
  "favicon-32.png",
  "icon-192.png",
  "icon-512.png"
]));
copyDir(path.join(root, "marketing"), path.join(dist, "marketing"), new Set([
  "medholic-wordmark-logo.png",
  "medholic-wordmark-logo-warm.png",
  "medholic-branded-preview.jpg",
  "medholic-luxury-boardroom.jpg",
  "spotit-logo.png",
  "spotit-logo-warm.png",
  "spotit-flyer-man-private.jpg",
  "spotit-flyer-female-private.jpg"
]));
copyFile(
  path.join(root, "docs", "final-business-launch-checklist.md"),
  path.join(dist, "docs", "final-business-launch-checklist.md")
);
copyFile(path.join(root, "site.webmanifest"), path.join(dist, "site.webmanifest"));
copyFile(path.join(root, "robots.txt"), path.join(dist, "robots.txt"));
copyFile(path.join(root, "sitemap.xml"), path.join(dist, "sitemap.xml"));
copyFile(path.join(root, "assets", "favicon.ico"), path.join(dist, "favicon.ico"));
copyFile(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

fs.mkdirSync(serverDir, { recursive: true });
const brandedPreviewBase64 = fileBase64(path.join("marketing", "medholic-branded-preview.jpg"));
const spotitLogoBase64 = fileBase64(path.join("marketing", "spotit-logo.png"));
const spotitLogoWarmBase64 = fileBase64(path.join("marketing", "spotit-logo-warm.png"));
const medholicLogoWarmBase64 = fileBase64(path.join("marketing", "medholic-wordmark-logo-warm.png"));
const faviconBase64 = fileBase64(path.join("assets", "favicon.ico"));
const robotsTxt = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemapXml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
fs.writeFileSync(path.join(serverDir, "index.js"), `const html = ${JSON.stringify(html)};
const spotitHtml = ${JSON.stringify(spotitHtml)};
const brandedPreviewBase64 = ${JSON.stringify(brandedPreviewBase64)};
const spotitLogoBase64 = ${JSON.stringify(spotitLogoBase64)};
const spotitLogoWarmBase64 = ${JSON.stringify(spotitLogoWarmBase64)};
const medholicLogoWarmBase64 = ${JSON.stringify(medholicLogoWarmBase64)};
const faviconBase64 = ${JSON.stringify(faviconBase64)};
const robotsTxt = ${JSON.stringify(robotsTxt)};
const sitemapXml = ${JSON.stringify(sitemapXml)};

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (url.pathname === "/spotit" || url.pathname === "/spotit/" || url.pathname === "/spotit/index.html") {
      return new Response(spotitHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (url.pathname === "/marketing/medholic-branded-preview.jpg") {
      return new Response(base64ToBytes(brandedPreviewBase64), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/marketing/spotit-logo.png") {
      return new Response(base64ToBytes(spotitLogoBase64), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/marketing/spotit-logo-warm.png") {
      return new Response(base64ToBytes(spotitLogoWarmBase64), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/marketing/medholic-wordmark-logo-warm.png") {
      return new Response(base64ToBytes(medholicLogoWarmBase64), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/favicon.ico") {
      return new Response(base64ToBytes(faviconBase64), {
        headers: {
          "Content-Type": "image/x-icon",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/robots.txt") {
      return new Response(robotsTxt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/sitemap.xml") {
      return new Response(sitemapXml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    if (["/app", "/login", "/signin", "/signin-with-chatgpt", "/patient", "/patients", "/dashboard", "/admin", "/api", "/private"].some((privatePath) => url.pathname === privatePath || url.pathname.startsWith(privatePath + "/"))) {
      return new Response("Not found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow"
        }
      });
    }

    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex"
      }
    });
  }
};
`);

console.log("Built Medholic public site in dist.");
