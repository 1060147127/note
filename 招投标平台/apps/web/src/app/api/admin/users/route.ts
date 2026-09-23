import { z } from "zod";
import { Role } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { hashPassword, requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    await requireUser([Role.ADMIN]);
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        orgName: true,
        createdAt: true,
      },
    });
    return jsonOk({ users });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["BUYER", "BIDDER"]),
  orgName: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    await requireUser([Role.ADMIN]);
    const body = createSchema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return jsonError("邮箱已存在", 409);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        role: body.role,
        orgName: body.orgName,
      },
      select: {
        id: true,
        email: true,
        role: true,
        orgName: true,
        createdAt: true,
      },
    });
    return jsonOk({ user }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
