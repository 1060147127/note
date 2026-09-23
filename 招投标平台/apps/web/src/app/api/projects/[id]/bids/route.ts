import { BidStatus, Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { saveObject } from "@/lib/storage";
import { advanceProjectIfNeeded } from "@/lib/project-status";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BIDDER]);
    const { id: projectId } = await ctx.params;
    await advanceProjectIfNeeded(projectId);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return jsonError("项目不存在", 404);
    if (project.status !== ProjectStatus.BIDDING) {
      return jsonError("当前不接受投标", 400);
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("缺少投标文件");

    const buf = Buffer.from(await file.arrayBuffer());
    const saved = await saveObject(`bids/${projectId}/${user.id}`, file.name, buf);

    const existing = await prisma.bid.findUnique({
      where: { projectId_bidderId: { projectId, bidderId: user.id } },
      include: { files: true },
    });

    let bid;
    if (existing) {
      if (existing.status === BidStatus.SUBMITTED) {
        return jsonError("已提交，请先撤回再重新上传", 400);
      }
      const version = (existing.files[0]?.version || 0) + 1;
      bid = await prisma.bid.update({
        where: { id: existing.id },
        data: {
          status: BidStatus.SUBMITTED,
          submittedAt: new Date(),
          files: {
            create: {
              storageKey: saved.storageKey,
              filename: file.name,
              hash: saved.hash,
              size: saved.size,
              version,
            },
          },
        },
        include: { files: true },
      });
    } else {
      bid = await prisma.bid.create({
        data: {
          projectId,
          bidderId: user.id,
          status: BidStatus.SUBMITTED,
          submittedAt: new Date(),
          files: {
            create: {
              storageKey: saved.storageKey,
              filename: file.name,
              hash: saved.hash,
              size: saved.size,
              version: 1,
            },
          },
        },
        include: { files: true },
      });
    }
    return jsonOk({ bid }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
