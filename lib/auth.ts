// Signed, stateless session tokens — verified with HMAC-SHA256 via the Web
// Crypto API so this works in both the proxy's Edge runtime and Node.js API
// routes without needing a server-side session store.
//
// This is a placeholder-grade auth setup: one hardcoded admin account from
// env vars, no password hashing (a single shared secret, not per-user
// credentials in a database). Swap for a real auth provider or a database-
// backed user table once there's more than one admin.

const encoder = new TextEncoder();

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const byte of arr) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const str = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(str.length));
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(email: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");

  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${email}:${expiresAt}`;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return `${toBase64Url(encoder.encode(payload))}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) return false;

  const payload = new TextDecoder().decode(fromBase64Url(payloadB64));
  const expiresAt = Number(payload.split(":")[1]);
  if (!expiresAt || Date.now() > expiresAt) return false;

  const key = await getKey(secret);
  return crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signatureB64),
    encoder.encode(payload)
  );
}
