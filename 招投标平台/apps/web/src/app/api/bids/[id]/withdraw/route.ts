import { BidStatus, Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { advanceProjectIfNeeded } from "@/lib/project-status";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BIDDER]);
    const { id } = await ctx.params;
    const bid = await prisma.bid.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!bid || bid.bidderId !== user.id) return jsonError("无权限", 403);
    await advanceProjectIfNeeded(bid.projectId);
    const project = await prisma.project.findUnique({ where: { id: bid.projectId } });
    if (!project || project.status !== ProjectStatus.BIDDING) {
      return jsonError("截止后不可撤回", 400);
    }
    if (bid.status !== BidStatus.SUBMITTED) return jsonError("当前状态不可撤回", 400);

    const updated = await prisma.bid.update({
      where: { id },
      data: { status: BidStatus.WITHDRAWN, submittedAt: null },
    });
    return jsonOk({ bid: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
