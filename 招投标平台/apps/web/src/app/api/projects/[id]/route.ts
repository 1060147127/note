import { Role, ProjectStatus } from "@/lib/constants";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { advanceProjectIfNeeded } from "@/lib/project-status";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const user = await requireUser();
    const { id } = await ctx.params;
    await advanceProjectIfNeeded(id);
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, orgName: true, email: true } },
        files: true,
        announcement: true,
        evaluations: true,
        bids:
          user.role === Role.BUYER || user.role === Role.ADMIN
            ? {
                include: {
                  bidder: { select: { id: true, orgName: true, email: true } },
                  files: true,
                  evaluation: true,
                },
              }
            : {
                where: { bidderId: user.id },
                include: { files: true, evaluation: true },
              },
      },
    });
    if (!project) return jsonError("项目不存在", 404);
    if (project.status === ProjectStatus.DRAFT && project.buyerId !== user.id && user.role !== Role.ADMIN) {
      return jsonError("项目不存在", 404);
    }
    if (user.role === Role.BUYER && project.buyerId !== user.id && user.role !== Role.ADMIN) {
      // buyers only see own — already filtered for list; detail guard
    }
    if (user.role === Role.BUYER && project.buyerId !== user.id) {
      return jsonError("无权限", 403);
    }
    return jsonOk({ project });
  } catch (err) {
    return handleApiError(err);
  }
}

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  bidDeadline: z.string().datetime().nullable().optional(),
  scoringRules: z.string().optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (project.status !== ProjectStatus.DRAFT) return jsonError("仅草稿可编辑", 400);
    const body = patchSchema.parse(await req.json());
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        scoringRules: body.scoringRules,
        bidDeadline:
          body.bidDeadline === undefined
            ? undefined
            : body.bidDeadline
              ? new Date(body.bidDeadline)
              : null,
      },
    });
    return jsonOk({ project: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
