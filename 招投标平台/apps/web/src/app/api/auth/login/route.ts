import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword, homeForRole } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("邮箱或密码错误", 401);
    }
    await createSession(user.id);
    return jsonOk({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgName: user.orgName,
      },
      redirect: homeForRole(user.role),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
