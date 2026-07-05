const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || 4177);
const databaseUrl = process.env.DATABASE_URL || "";
const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "";
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
const staffAccountsJson = process.env.STAFF_ACCOUNTS_JSON || "";
const sessions = new Map();
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "medholic-state.json");
const backupDir = path.join(dataDir, "backups");
let pgPool = null;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const emptyState = {
  medicines: [],
  sales: [],
  employees: [],
  auditLogs: [],
  cashChecks: [],
  stockAdjustments: [],
  updatedAt: ""
};

if (databaseUrl) {
  try {
    const { Pool } = require("pg");
    pgPool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
    });
  } catch (error) {
    console.warn("Postgres dependency is unavailable, falling back to file storage:", error.message);
  }
}

async function initDatabase() {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS medholic_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS medholic_state_backups (
      id BIGSERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function getBearerToken(request) {
  const header = request.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function getSessionUser(request) {
  const token = getBearerToken(request);
  return token ? sessions.get(token) : null;
}

function requireAuth(request, response) {
  const user = getSessionUser(request);
  if (!user) {
    sendJson(response, 401, { ok: false, error: "Login required" });
    return null;
  }
  return user;
}

function requireManager(request, response) {
  const user = requireAuth(request, response);
  if (!user) return null;
  if (String(user.role || "").toLowerCase() !== "manager") {
    sendJson(response, 403, { ok: false, error: "Manager access required" });
    return null;
  }
  return user;
}

function verifyPassword(password) {
  if (!adminPasswordHash) return password === adminPassword;
  const parts = adminPasswordHash.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = Buffer.from(parts[2], "hex");
  const expected = Buffer.from(parts[3], "hex");
  const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function verifyHash(password, storedHash) {
  const parts = String(storedHash || "").split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = Buffer.from(parts[2], "hex");
  const expected = Buffer.from(parts[3], "hex");
  const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function getStaffAccounts() {
  const accounts = [];

  if (adminEmail && (adminPassword || adminPasswordHash)) {
    accounts.push({
      username: adminEmail,
      password: adminPassword,
      passwordHash: adminPasswordHash,
      name: process.env.ADMIN_NAME || "Lynda Chidi",
      role: "Manager"
    });
  }

  if (!staffAccountsJson) return accounts;
  try {
    const parsed = JSON.parse(staffAccountsJson);
    if (Array.isArray(parsed)) {
      parsed.forEach((account) => {
        if (account.username && (account.password || account.passwordHash)) {
          accounts.push({
            username: String(account.username).toLowerCase(),
            password: account.password || "",
            passwordHash: account.passwordHash || "",
            name: account.name || account.username,
            role: account.role || "Staff"
          });
        }
      });
    }
  } catch (error) {
    console.warn("Invalid STAFF_ACCOUNTS_JSON:", error.message);
  }
  return accounts;
}

function findStaffUser(username, password) {
  return getStaffAccounts().find((account) => {
    if (account.username !== username) return false;
    if (account.passwordHash) return verifyHash(password, account.passwordHash);
    return account.password === password;
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function loadStateFromFile() {
  if (!fs.existsSync(dataFile)) return emptyState;
  try {
    return { ...emptyState, ...JSON.parse(fs.readFileSync(dataFile, "utf8")) };
  } catch {
    return emptyState;
  }
}

function saveStateToFile(state) {
  fs.mkdirSync(dataDir, { recursive: true });
  const existing = loadStateFromFile();
  if (Object.values(existing).some((value) => Array.isArray(value) && value.length > 0)) {
    fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(path.join(backupDir, `medholic-backup-${stamp}.json`), JSON.stringify(existing, null, 2));
  }
  fs.writeFileSync(dataFile, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2));
}

async function loadState() {
  if (!pgPool) return loadStateFromFile();
  const result = await pgPool.query("SELECT data, updated_at FROM medholic_state WHERE id = $1", ["main"]);
  if (!result.rows.length) return emptyState;
  return {
    ...emptyState,
    ...result.rows[0].data,
    updatedAt: result.rows[0].updated_at
  };
}

async function saveState(state) {
  if (!pgPool) {
    saveStateToFile(state);
    return;
  }
  const existing = await loadState();
  if (Object.values(existing).some((value) => Array.isArray(value) && value.length > 0)) {
    await pgPool.query("INSERT INTO medholic_state_backups (data) VALUES ($1)", [existing]);
    await pgPool.query(`
      DELETE FROM medholic_state_backups
      WHERE id NOT IN (
        SELECT id FROM medholic_state_backups ORDER BY created_at DESC LIMIT 50
      )
    `);
  }
  await pgPool.query(
    `INSERT INTO medholic_state (id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    ["main", state]
  );
}

function isManager(user) {
  return String(user?.role || "").toLowerCase() === "manager";
}

function sanitizeMedicineForStaff(item) {
  return {
    id: item.id,
    name: item.name,
    barcode: item.barcode,
    batch: item.batch || "",
    quantity: Number(item.quantity || 0),
    left: Number(item.left || 0),
    price: Number(item.price || 0),
    reorder: Number(item.reorder || 0),
    expiry: item.expiry || "",
    controlled: Boolean(item.controlled),
    function: item.function || "",
    dose: item.dose || "",
    sideEffects: item.sideEffects || "",
    otherNotes: item.otherNotes || ""
  };
}

function sanitizeStateForUser(state, user) {
  if (isManager(user)) return state;
  return {
    medicines: (state.medicines || []).map(sanitizeMedicineForStaff),
    sales: [],
    employees: (state.employees || []).map((employee) => ({
      id: employee.id,
      name: employee.name,
      role: employee.role || "Staff",
      shift: employee.shift || ""
    })),
    auditLogs: [],
    cashChecks: [],
    stockAdjustments: [],
    updatedAt: state.updatedAt || ""
  };
}

function mergeStaffSaleState(currentState, incomingState, user) {
  const state = { ...emptyState, ...currentState };
  const existingSaleIds = new Set((state.sales || []).map((sale) => sale.id).filter(Boolean));
  const newSales = (incomingState.sales || []).filter((sale) => sale.id && !existingSaleIds.has(sale.id));

  newSales.forEach((sale) => {
    const medicine = (state.medicines || []).find((item) => item.id === sale.medicineId || item.barcode === sale.barcode);
    const quantity = Number(sale.quantity || 0);
    if (!medicine || !Number.isFinite(quantity) || quantity <= 0 || quantity > Number(medicine.left || 0)) return;

    medicine.left = Number(medicine.left || 0) - quantity;
    state.sales.push({
      id: sale.id,
      medicineId: medicine.id,
      medicineName: medicine.name,
      barcode: medicine.barcode,
      quantity,
      employee: sale.employee || user.name || user.username,
      paymentMethod: sale.paymentMethod || "Cash",
      doctorReport: sale.doctorReport || "",
      unitPrice: Number(medicine.price || 0),
      unitCost: Number(medicine.cost || 0),
      total: quantity * Number(medicine.price || 0),
      gain: quantity * (Number(medicine.price || 0) - Number(medicine.cost || 0)),
      soldAt: sale.soldAt || new Date().toISOString()
    });
    state.auditLogs = state.auditLogs || [];
    state.auditLogs.push({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      user: user.name || user.username,
      role: user.role || "Staff",
      action: "Staff sale recorded",
      details: `${quantity} x ${medicine.name} sold by ${sale.employee || user.name || user.username}.`,
      risk: quantity >= 20 ? "Medium" : "Low"
    });
  });

  return state;
}

async function recordLoginAudit(user, request, portalPath = "") {
  const state = await loadState();
  const forwardedFor = request.headers["x-forwarded-for"];
  const ip = String(forwardedFor || request.socket.remoteAddress || "").split(",")[0].trim();
  const route = portalPath || request.headers.referer || "Unknown page";
  state.auditLogs = state.auditLogs || [];
  state.auditLogs.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    user: user.name || user.username,
    role: user.role || "Staff",
    action: "Login",
    details: `${user.name || user.username} signed in as ${user.role || "Staff"} from ${route}. IP: ${ip || "unknown"}.`,
    risk: String(user.role || "").toLowerCase() === "manager" ? "Medium" : "Low"
  });
  state.auditLogs = state.auditLogs.slice(0, 500);
  await saveState(state);
}

async function loadBackup(backupId) {
  if (pgPool) {
    const result = await pgPool.query("SELECT data, created_at FROM medholic_state_backups WHERE id = $1", [backupId]);
    if (!result.rows.length) return null;
    return {
      id: String(backupId),
      created_at: result.rows[0].created_at,
      data: { ...emptyState, ...result.rows[0].data }
    };
  }

  const safeName = String(backupId || "");
  if (!/^medholic-backup-[\w.-]+\.json$/.test(safeName)) return null;
  const filePath = path.join(backupDir, safeName);
  if (!filePath.startsWith(backupDir) || !fs.existsSync(filePath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      id: safeName,
      created_at: safeName.replace("medholic-backup-", "").replace(".json", ""),
      data: { ...emptyState, ...data }
    };
  } catch {
    return null;
  }
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/health") {
    sendJson(response, 200, { ok: true, app: "Medholic Pharmacy", storage: pgPool ? "postgres" : "file" });
    return true;
  }

  if (pathname === "/api/login" && request.method === "POST") {
    try {
      const body = JSON.parse((await readBody(request)) || "{}");
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const staffUser = findStaffUser(username, password);
      if (!staffUser) {
        sendJson(response, 401, { ok: false, error: "Invalid login" });
        return true;
      }
      const token = crypto.randomUUID();
      const user = { username: staffUser.username, name: staffUser.name, role: staffUser.role };
      sessions.set(token, user);
      await recordLoginAudit(user, request, String(body.portal || ""));
      sendJson(response, 200, { ok: true, token, user });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    const token = getBearerToken(request);
    if (token) sessions.delete(token);
    sendJson(response, 200, { ok: true });
    return true;
  }

  if (pathname === "/api/state" && request.method === "GET") {
    const user = requireAuth(request, response);
    if (!user) return true;
    sendJson(response, 200, sanitizeStateForUser(await loadState(), user));
    return true;
  }

  if (pathname === "/api/backups" && request.method === "GET") {
    if (!requireManager(request, response)) return true;
    if (pgPool) {
      const result = await pgPool.query("SELECT id, created_at FROM medholic_state_backups ORDER BY created_at DESC LIMIT 50");
      sendJson(response, 200, { ok: true, backups: result.rows });
    } else {
      const backups = fs.existsSync(backupDir)
        ? fs.readdirSync(backupDir).filter((name) => name.endsWith(".json")).sort().reverse().slice(0, 50)
        : [];
      sendJson(response, 200, { ok: true, backups: backups.map((name) => ({ id: name, created_at: name.replace("medholic-backup-", "").replace(".json", "") })) });
    }
    return true;
  }

  const backupDownloadMatch = pathname.match(/^\/api\/backups\/([^/]+)$/);
  if (backupDownloadMatch && request.method === "GET") {
    if (!requireManager(request, response)) return true;
    const backup = await loadBackup(decodeURIComponent(backupDownloadMatch[1]));
    if (!backup) {
      sendJson(response, 404, { ok: false, error: "Backup not found" });
      return true;
    }
    sendJson(response, 200, backup.data);
    return true;
  }

  const backupRestoreMatch = pathname.match(/^\/api\/backups\/([^/]+)\/restore$/);
  if (backupRestoreMatch && request.method === "POST") {
    const user = requireManager(request, response);
    if (!user) return true;
    try {
      const body = JSON.parse((await readBody(request)) || "{}");
      if (String(body.confirm || "").trim().toUpperCase() !== "RESTORE") {
        sendJson(response, 400, { ok: false, error: "Type RESTORE to confirm" });
        return true;
      }
      const backup = await loadBackup(decodeURIComponent(backupRestoreMatch[1]));
      if (!backup) {
        sendJson(response, 404, { ok: false, error: "Backup not found" });
        return true;
      }
      const restoredState = {
        ...backup.data,
        auditLogs: [
          ...(backup.data.auditLogs || []),
          {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            user: user.name || user.username,
            action: "Backup restored",
            details: `Backup ${backup.id} restored by ${user.name || user.username}. Current data was backed up before restore.`,
            risk: "High"
          }
        ]
      };
      await saveState(restoredState);
      sendJson(response, 200, { ok: true, state: restoredState });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  if (pathname === "/api/state" && request.method === "POST") {
    const user = requireAuth(request, response);
    if (!user) return true;
    try {
      const body = await readBody(request);
      const incomingState = JSON.parse(body || "{}");
      const state = isManager(user)
        ? incomingState
        : mergeStaffSaleState(await loadState(), incomingState, user);
      await saveState(state);
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  const pathname = decodeURIComponent(request.url.split("?")[0]);
  if (await handleApi(request, response, pathname)) return;

  let requestedPath = pathname;
  if (pathname === "/") requestedPath = "/landing.html";
  if (pathname === "/app" || pathname === "/app/") requestedPath = "/index.html";
  if (pathname === "/staff" || pathname === "/staff/") requestedPath = "/staff.html";
  let filePath = path.resolve(root, `.${requestedPath}`);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${pathname}/` });
        response.end();
        return;
      }
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
});

initDatabase()
  .then(() => {
    server.listen(port, "0.0.0.0", () => {
      console.log(`Medholic Pharmacy is running on port ${port} with ${pgPool ? "Postgres" : "file"} storage`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize Medholic Pharmacy server:", error);
    process.exit(1);
  });
