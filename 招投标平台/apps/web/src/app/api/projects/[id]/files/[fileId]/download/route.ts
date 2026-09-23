import { Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { readObject } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string; fileId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    const { id, fileId } = await ctx.params;
    const file = await prisma.projectFile.findFirst({
      where: { id: fileId, projectId: id },
      include: { project: true },
    });
    if (!file) return jsonError("文件不存在", 404);
    const p = file.project;
    const allowed =
      user.role === Role.ADMIN ||
      p.buyerId === user.id ||
      (user.role === Role.BIDDER && p.status !== ProjectStatus.DRAFT);
    if (!allowed) return jsonError("无权限", 403);

    const data = await readObject(file.storageKey);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
