import { Role, ProjectStatus } from "@/lib/constants";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  evaluations: z
    .array(
      z.object({
        bidId: z.string(),
        score: z.number(),
        comment: z.string().optional(),
        isWinner: z.boolean().optional(),
      }),
    )
    .min(1),
});

export async function POST(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (
      project.status !== ProjectStatus.OPENED &&
      project.status !== ProjectStatus.EVALUATING
    ) {
      return jsonError("当前状态不可评标", 400);
    }

    const body = schema.parse(await req.json());
    const winners = body.evaluations.filter((e) => e.isWinner);
    if (winners.length !== 1) return jsonError("必须且只能选定一名中标人", 400);

    const ranked = [...body.evaluations].sort((a, b) => b.score - a.score);

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: { status: ProjectStatus.EVALUATING },
      });
      for (let i = 0; i < ranked.length; i++) {
        const e = ranked[i];
        await tx.evaluation.upsert({
          where: { bidId: e.bidId },
          create: {
            projectId: id,
            bidId: e.bidId,
            score: e.score,
            comment: e.comment || "",
            isWinner: !!e.isWinner,
            rank: i + 1,
          },
          update: {
            score: e.score,
            comment: e.comment || "",
            isWinner: !!e.isWinner,
            rank: i + 1,
          },
        });
      }
      await tx.project.update({
        where: { id },
        data: { status: ProjectStatus.AWARDED },
      });
    });

    const evaluations = await prisma.evaluation.findMany({
      where: { projectId: id },
      include: { bid: { include: { bidder: { select: { orgName: true, email: true } } } } },
    });
    return jsonOk({ evaluations });
  } catch (err) {
    return handleApiError(err);
  }
}
