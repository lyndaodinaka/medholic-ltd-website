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
const accessRequestTypes = new Set();
const leadStatuses = new Set();
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "medholic-state.json");
const accessRequestsFile = path.join(dataDir, "access-requests.json");
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
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS medholic_access_requests (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      request_type TEXT NOT NULL,
      message TEXT,
      lead_status TEXT NOT NULL DEFAULT 'New',
      lead_notes TEXT NOT NULL DEFAULT '',
      follow_up_date TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pgPool.query("ALTER TABLE medholic_access_requests ADD COLUMN IF NOT EXISTS lead_status TEXT NOT NULL DEFAULT 'New'");
  await pgPool.query("ALTER TABLE medholic_access_requests ADD COLUMN IF NOT EXISTS lead_notes TEXT NOT NULL DEFAULT ''");
  await pgPool.query("ALTER TABLE medholic_access_requests ADD COLUMN IF NOT EXISTS follow_up_date TEXT NOT NULL DEFAULT ''");
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

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function loadAccessRequestsFromFile() {
  if (!fs.existsSync(accessRequestsFile)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(accessRequestsFile, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccessRequestToFile(record) {
  fs.mkdirSync(dataDir, { recursive: true });
  const records = loadAccessRequestsFromFile();
  records.unshift(record);
  fs.writeFileSync(accessRequestsFile, JSON.stringify(records.slice(0, 500), null, 2));
}

function updateAccessRequestFileStatus(id, status) {
  const records = loadAccessRequestsFromFile();
  const record = records.find((item) => String(item.id) === String(id));
  if (!record) return null;
  record.leadStatus = status;
  record.lead_status = status;
  fs.writeFileSync(accessRequestsFile, JSON.stringify(records, null, 2));
  return record;
}

function updateAccessRequestFileLead(id, updates) {
  const records = loadAccessRequestsFromFile();
  const record = records.find((item) => String(item.id) === String(id));
  if (!record) return null;
  if (updates.status) {
    record.leadStatus = updates.status;
    record.lead_status = updates.status;
  }
  if (Object.prototype.hasOwnProperty.call(updates, "leadNotes")) {
    record.leadNotes = updates.leadNotes;
    record.lead_notes = updates.leadNotes;
  }
  if (Object.prototype.hasOwnProperty.call(updates, "followUpDate")) {
    record.followUpDate = updates.followUpDate;
    record.follow_up_date = updates.followUpDate;
  }
  fs.writeFileSync(accessRequestsFile, JSON.stringify(records, null, 2));
  return record;
}

async function saveAccessRequest(record) {
  if (!pgPool) {
    saveAccessRequestToFile(record);
    return record;
  }
  const result = await pgPool.query(
    `INSERT INTO medholic_access_requests (name, email, request_type, message, lead_status, lead_notes, follow_up_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, request_type, message, lead_status, lead_notes, follow_up_date, created_at`,
    [record.name, record.email, record.requestType, record.message, record.leadStatus || "New", record.leadNotes || "", record.followUpDate || ""]
  );
  return result.rows[0];
}

async function listAccessRequests() {
  if (!pgPool) return loadAccessRequestsFromFile().slice(0, 200);
  const result = await pgPool.query(`
    SELECT id, name, email, request_type, message, lead_status, lead_notes, follow_up_date, created_at
    FROM medholic_access_requests
    ORDER BY created_at DESC
    LIMIT 200
  `);
  return result.rows;
}

async function updateAccessRequestStatus(id, status) {
  if (!leadStatuses.has(status)) throw new Error("Invalid lead status");
  if (!pgPool) {
    const record = updateAccessRequestFileStatus(id, status);
    if (!record) throw new Error("Access request not found");
    return record;
  }
  const result = await pgPool.query(
    `UPDATE medholic_access_requests
     SET lead_status = $1
     WHERE id = $2
     RETURNING id, name, email, request_type, message, lead_status, created_at`,
    [status, id]
  );
  if (!result.rows.length) throw new Error("Access request not found");
  return result.rows[0];
}

async function updateAccessRequestLead(id, updates) {
  const status = String(updates.status || "").trim();
  const leadNotes = String(updates.leadNotes || "").trim().slice(0, 1000);
  const followUpDate = String(updates.followUpDate || "").trim().slice(0, 40);
  if (status && !leadStatuses.has(status)) throw new Error("Invalid lead status");
  if (!pgPool) {
    const record = updateAccessRequestFileLead(id, {
      status,
      leadNotes,
      followUpDate
    });
    if (!record) throw new Error("Access request not found");
    return record;
  }
  const result = await pgPool.query(
    `UPDATE medholic_access_requests
     SET lead_status = COALESCE(NULLIF($1, ''), lead_status),
         lead_notes = $2,
         follow_up_date = $3
     WHERE id = $4
     RETURNING id, name, email, request_type, message, lead_status, lead_notes, follow_up_date, created_at`,
    [status, leadNotes, followUpDate, id]
  );
  if (!result.rows.length) throw new Error("Access request not found");
  return result.rows[0];
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

  if (pathname === "/api/access-request" || pathname.startsWith("/api/access-requests")) {
    sendJson(response, 404, { ok: false, error: "Access requests are disabled for this private Medholic Pharmacy app." });
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
      sendJson(response, 200, { ok: true, token, user });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  if (pathname === "/api/access-request" && request.method === "POST") {
    try {
      const body = JSON.parse((await readBody(request)) || "{}");
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const requestType = String(body.requestType || "").trim();
      const message = String(body.message || "").trim();
      if (!name || !isValidEmail(email) || !accessRequestTypes.has(requestType)) {
        sendJson(response, 400, { ok: false, error: "Name, valid email, and request type are required" });
        return true;
      }
      const record = {
        id: crypto.randomUUID(),
        name,
        email,
        requestType,
        request_type: requestType,
        message,
        leadStatus: "New",
        lead_status: "New",
        leadNotes: "",
        lead_notes: "",
        followUpDate: "",
        follow_up_date: "",
        created_at: new Date().toISOString()
      };
      await saveAccessRequest(record);
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  if (pathname === "/api/access-requests" && request.method === "GET") {
    if (!requireManager(request, response)) return true;
    sendJson(response, 200, { ok: true, requests: await listAccessRequests() });
    return true;
  }

  const accessRequestStatusMatch = pathname.match(/^\/api\/access-requests\/([^/]+)\/status$/);
  if (accessRequestStatusMatch && request.method === "PATCH") {
    if (!requireManager(request, response)) return true;
    try {
      const body = JSON.parse((await readBody(request)) || "{}");
      const status = String(body.status || "").trim();
      const updated = await updateAccessRequestStatus(decodeURIComponent(accessRequestStatusMatch[1]), status);
      sendJson(response, 200, { ok: true, request: updated });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return true;
  }

  const accessRequestLeadMatch = pathname.match(/^\/api\/access-requests\/([^/]+)\/lead$/);
  if (accessRequestLeadMatch && request.method === "PATCH") {
    if (!requireManager(request, response)) return true;
    try {
      const body = JSON.parse((await readBody(request)) || "{}");
      const updated = await updateAccessRequestLead(decodeURIComponent(accessRequestLeadMatch[1]), body);
      sendJson(response, 200, { ok: true, request: updated });
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
    if (!requireAuth(request, response)) return true;
    sendJson(response, 200, await loadState());
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
    if (!requireAuth(request, response)) return true;
    try {
      const body = await readBody(request);
      const state = JSON.parse(body || "{}");
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
  let filePath = path.resolve(root, `.${requestedPath}`);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
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
