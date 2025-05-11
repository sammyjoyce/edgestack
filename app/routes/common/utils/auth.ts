import { assert } from "./assert";

export const COOKIE_NAME = "lush_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 2;
const enc = new TextEncoder();
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
				["sign"],
			),
		);
	}
	return keyCache.get(secret)!;
}

function bytesToHex(buf: ArrayBuffer): string {
	return [...new Uint8Array(buf)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

function toHex(buf: Uint8Array): string {
	return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sign(value: string, secret: string): Promise<string> {
	try {
		const key = await getKey(secret);
		const mac = await crypto.subtle.sign("HMAC", key, enc.encode(value));
		return `${value}.${toHex(new Uint8Array(mac))}`;
	} catch (error) {
		console.error("[AUTH] Error during signing:", error);
		throw new Error("Failed to sign session token");
	}
}

export async function verify(
	signed: string,
	secret: string,
): Promise<string | false> {
	const idx = signed.lastIndexOf(".");
	if (idx === -1) return false;
	const value = signed.slice(0, idx);
	const macHex = signed.slice(idx + 1);
	const key = await getKey(secret);
	const mac = await crypto.subtle.sign("HMAC", key, enc.encode(value));
	const expectedHex = bytesToHex(mac);
	if (macHex.length !== expectedHex.length) return false;
	let diff = 0;
	for (let i = 0; i < macHex.length; i++) {
		diff |= macHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
	}
	return diff === 0 ? value : false;
}

export function getSessionCookie(req: Request): string | null {
	const cookieHeader = req.headers.get("cookie") ?? "";
	for (const pair of cookieHeader.split(";")) {
		const [rawName, rawVal] = pair.trim().split("=", 2);
		if (rawName === COOKIE_NAME) return decodeURIComponent(rawVal ?? "");
	}
	return null;
}

export async function requireAdmin(
	request: Request,
	context: any,
): Promise<void> {
	assert(request instanceof Request, "requireAdmin: request must be a Request");
	assert(
		context && typeof context === "object",
		"requireAdmin: context must be an object",
	);
	const sessionValue = getSessionCookie(request);
	const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
	if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
		throw new Response("Unauthorized", { status: 401 });
	}
}
