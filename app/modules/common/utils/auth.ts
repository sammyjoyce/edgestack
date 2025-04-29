// ────────────────────────────────────────────────────────────────────────────
// Auth helpers for the admin area
// - HMAC‑based session cookie signing / verification
// - Tiny cookie extractor for the Cloudflare/Bun runtime
// ────────────────────────────────────────────────────────────────────────────

export const COOKIE_NAME = "lush_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

// Shared TextEncoder instance (Web Crypto recommends re‑using)
const enc = new TextEncoder();

// Cache CryptoKeys per secret to avoid re‑importing on every call
const keyCache = new Map<string, Promise<CryptoKey>>();

async function getKey(secret: string): Promise<CryptoKey> {
  if (!keyCache.has(secret)) {
    keyCache.set(
      secret,
      crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
    );
  }
  return keyCache.get(secret)!;
}

function bytesToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Sign a session payload (`value`) with the given `secret`. */
export async function sign(value: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return `${value}.${bytesToHex(mac)}`;
}

/** Verify a signed cookie string and return the original value if valid, else `false`. */
export async function verify(signed: string, secret: string): Promise<string | false> {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return false;

  const value = signed.slice(0, idx);
  const macHex = signed.slice(idx + 1);

  const key = await getKey(secret);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  const expectedHex = bytesToHex(mac);

  // Constant‑time comparison to mitigate timing attacks
  if (macHex.length !== expectedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < macHex.length; i++) {
    diff |= macHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return diff === 0 ? value : false;
}

/** Extract the admin session cookie from a request. */
export function getSessionCookie(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  for (const pair of cookieHeader.split(";")) {
    const [rawName, rawVal] = pair.trim().split("=", 2);
    if (rawName === COOKIE_NAME) return decodeURIComponent(rawVal ?? "");
  }
  return null;
}