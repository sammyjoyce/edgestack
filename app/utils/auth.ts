// Shared authentication utilities for admin session cookies
// Bun: Use Web Crypto API (native in Bun)
export const COOKIE_NAME = "lush_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

export async function sign(value: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return value + "." + sigHex;
}

export async function verify(signed: string, secret: string) {
  const [value, sig] = signed.split(".");
  if (!value || !sig) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return sig === sigHex ? value : false;
}

export function getSessionCookie(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const session = cookie
    .split(";")
    .find((c) => c.trim().startsWith(COOKIE_NAME + "="));
  return session ? session.split("=")[1] : null;
}
