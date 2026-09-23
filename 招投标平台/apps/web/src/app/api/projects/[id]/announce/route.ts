import { Role, ProjectStatus } from "@/lib/constants";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  content: z.string().min(1),
});

export async function POST(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        evaluations: {
          where: { isWinner: true },
          include: { bid: { include: { bidder: true } } },
        },
      },
    });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (project.status !== ProjectStatus.AWARDED) return jsonError("仅已定标项目可公示", 400);

    const body = schema.parse(await req.json());
    const winner = project.evaluations[0];
    const content =
      body.content +
      (winner
        ? `\n\n中标单位：${winner.bid.bidder.orgName}（${winner.bid.bidder.email}），得分：${winner.score}`
        : "");

    const announcement = await prisma.announcement.upsert({
      where: { projectId: id },
      create: { projectId: id, content },
      update: { content, publishedAt: new Date() },
    });
    const updated = await prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.ANNOUNCED },
    });
    return jsonOk({ project: updated, announcement });
  } catch (err) {
    return handleApiError(err);
  }
}
