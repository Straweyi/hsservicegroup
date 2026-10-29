import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "hs_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 jam
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 menit

type AttemptRecord = {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
};

const loginAttempts = new Map<string, AttemptRecord>();

function getEnvCredentials() {
  return {
    adminId: process.env.ADMIN_ID || "hspunyaadmin",
    email: (process.env.ADMIN_EMAIL || "admin@hssg.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "hssgpassword",
    secret: process.env.ADMIN_SESSION_SECRET || "hssg-super-secret-hmac-key-2026-secure-cms",
  };
}

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function signToken(payload: { adminId: string; email: string; exp: number }, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyToken(token: string, secret: string): { adminId: string; email: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  if (!safeCompare(sig, expectedSig)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local-ip";
}

export async function GET(req: NextRequest) {
  const { secret } = getEnvCredentials();
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const session = verifyToken(token, secret);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    adminId: session.adminId,
    email: session.email,
    expiresAt: session.exp,
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record?.lockedUntil && now < record.lockedUntil) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan gagal. Akun dikunci sementara selama ${remainingMinutes} menit demi keamanan.`,
        locked: true,
      },
      { status: 429 }
    );
  }

  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const rawIdentifier = String(body.identifier ?? "").trim();
  const inputPassword = String(body.password ?? "");

  const { adminId, email, password, secret } = getEnvCredentials();

  // Bisa login menggunakan ID Admin (hspunyaadmin) ATAU Email Admin (admin@hssg.com)
  const isIdMatch = safeCompare(rawIdentifier, adminId);
  const isEmailMatch = safeCompare(rawIdentifier.toLowerCase(), email);
  const isIdentifierValid = isIdMatch || isEmailMatch;
  const isPasswordMatch = safeCompare(inputPassword, password);

  if (!isIdentifierValid || !isPasswordMatch) {
    const current =
      record && now - record.firstAttemptAt < LOCKOUT_WINDOW_MS
        ? { count: record.count + 1, firstAttemptAt: record.firstAttemptAt }
        : { count: 1, firstAttemptAt: now };

    if (current.count >= MAX_ATTEMPTS) {
      loginAttempts.set(ip, {
        ...current,
        lockedUntil: now + LOCKOUT_WINDOW_MS,
      });
      return NextResponse.json(
        {
          error: "Batas percobaan login (5x) terlampaui. Login dikunci selama 15 menit.",
          locked: true,
        },
        { status: 429 }
      );
    }

    loginAttempts.set(ip, current);
    const remaining = MAX_ATTEMPTS - current.count;
    return NextResponse.json(
      {
        error: `ID/Email Admin atau Password salah. Sisa percobaan: ${remaining}x.`,
        remainingAttempts: remaining,
      },
      { status: 401 }
    );
  }

  // Reset catatan gagal setelah berhasil login
  loginAttempts.delete(ip);

  const exp = now + SESSION_DURATION_MS;
  const token = signToken({ adminId, email, exp }, secret);

  const res = NextResponse.json({
    authenticated: true,
    adminId,
    email,
    expiresAt: exp,
  });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
