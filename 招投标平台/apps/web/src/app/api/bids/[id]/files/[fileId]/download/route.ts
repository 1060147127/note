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
    const file = await prisma.bidFile.findFirst({
      where: { id: fileId, bidId: id },
      include: { bid: { include: { project: true } } },
    });
    if (!file) return jsonError("文件不存在", 404);

    const bid = file.bid;
    const project = bid.project;
    const opened =
      project.status === ProjectStatus.OPENED ||
      project.status === ProjectStatus.EVALUATING ||
      project.status === ProjectStatus.AWARDED ||
      project.status === ProjectStatus.ANNOUNCED;

    const allowed =
      user.role === Role.ADMIN ||
      bid.bidderId === user.id ||
      (project.buyerId === user.id && opened);

    if (!allowed) return jsonError("无权限（开标前招标人不可下载投标文件）", 403);

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
