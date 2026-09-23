import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { Role } from "@/lib/constants";

const COOKIE = "bid_session";
const DAYS = 7;

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  orgName: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { token, userId, expiresAt } });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    jar.delete(COOKIE);
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  const { id, email, role, orgName } = session.user;
  return { id, email, role: role as Role, orgName };
}

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("未登录", 401);
  }
  if (roles && !roles.includes(user.role)) {
    throw new AuthError("无权限", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function homeForRole(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "BUYER":
      return "/buyer";
    case "BIDDER":
      return "/bidder";
    default:
      return "/login";
  }
}
