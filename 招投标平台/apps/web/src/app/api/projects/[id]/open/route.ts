import { BidStatus, Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { advanceProjectIfNeeded } from "@/lib/project-status";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    await advanceProjectIfNeeded(id);
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        bids: {
          where: { status: BidStatus.SUBMITTED },
          include: {
            bidder: { select: { id: true, orgName: true, email: true } },
            files: true,
          },
        },
      },
    });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (project.status !== ProjectStatus.CLOSED) {
      return jsonError("仅已截止项目可开标", 400);
    }

    const snapshot = {
      openedAt: new Date().toISOString(),
      bids: project.bids.map((b) => ({
        bidId: b.id,
        bidderId: b.bidderId,
        orgName: b.bidder.orgName,
        email: b.bidder.email,
        submittedAt: b.submittedAt,
        files: b.files.map((f) => ({
          id: f.id,
          filename: f.filename,
          hash: f.hash,
          size: f.size,
          version: f.version,
        })),
      })),
    };

    const updated = await prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.OPENED,
        openedAt: new Date(),
        openSnapshot: JSON.stringify(snapshot),
      },
    });
    return jsonOk({ project: updated, snapshot });
  } catch (err) {
    return handleApiError(err);
  }
}
