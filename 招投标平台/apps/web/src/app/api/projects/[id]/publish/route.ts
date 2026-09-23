import { Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { files: true },
    });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (project.status !== ProjectStatus.DRAFT) return jsonError("仅草稿可发布", 400);
    if (!project.bidDeadline) return jsonError("请先设置投标截止时间", 400);
    if (project.bidDeadline <= new Date()) return jsonError("截止时间必须晚于当前时间", 400);
    if (project.files.length === 0) return jsonError("请至少上传一份招标文件", 400);

    const updated = await prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.BIDDING,
        publishedAt: new Date(),
      },
    });
    return jsonOk({ project: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
