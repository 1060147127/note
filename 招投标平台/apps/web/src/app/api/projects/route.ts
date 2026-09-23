import { Role, ProjectStatus } from "@/lib/constants";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { advanceMany, advanceProjectIfNeeded } from "@/lib/project-status";

export async function GET() {
  try {
    const user = await requireUser();
    let projects;
    if (user.role === Role.ADMIN) {
      projects = await prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          buyer: { select: { id: true, orgName: true, email: true } },
          _count: { select: { bids: true, files: true } },
        },
      });
    } else if (user.role === Role.BUYER) {
      projects = await prisma.project.findMany({
        where: { buyerId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          buyer: { select: { id: true, orgName: true, email: true } },
          _count: { select: { bids: true, files: true } },
        },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { status: { not: ProjectStatus.DRAFT } },
        orderBy: { updatedAt: "desc" },
        include: {
          buyer: { select: { id: true, orgName: true, email: true } },
          _count: { select: { bids: true, files: true } },
          bids: {
            where: { bidderId: user.id },
            select: { id: true, status: true },
          },
        },
      });
    }
    await advanceMany(projects.map((p) => p.id));
    const refreshed = await prisma.project.findMany({
      where: { id: { in: projects.map((p) => p.id) } },
      orderBy: { updatedAt: "desc" },
      include: {
        buyer: { select: { id: true, orgName: true, email: true } },
        _count: { select: { bids: true, files: true } },
        ...(user.role === Role.BIDDER
          ? {
              bids: {
                where: { bidderId: user.id },
                select: { id: true, status: true },
              },
            }
          : {}),
      },
    });
    return jsonOk({ projects: refreshed });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  bidDeadline: z.string().datetime().optional(),
  scoringRules: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser([Role.BUYER]);
    const body = createSchema.parse(await req.json());
    const project = await prisma.project.create({
      data: {
        buyerId: user.id,
        title: body.title,
        description: body.description || "",
        bidDeadline: body.bidDeadline ? new Date(body.bidDeadline) : null,
        scoringRules: body.scoringRules || '{"method":"综合评分法","满分":100}',
      },
    });
    return jsonOk({ project }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
