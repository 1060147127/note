import { ProjectStatus } from "@/lib/constants";
import { prisma } from "./db";

/** 若投标中且已过截止时间，推进为 CLOSED */
export async function advanceProjectIfNeeded(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;
  if (
    project.status === ProjectStatus.BIDDING &&
    project.bidDeadline &&
    project.bidDeadline <= new Date()
  ) {
    return prisma.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.CLOSED },
    });
  }
  return project;
}

export async function advanceMany(projectIds: string[]) {
  await Promise.all(projectIds.map((id) => advanceProjectIfNeeded(id)));
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  DRAFT: "草稿",
  BIDDING: "投标中",
  CLOSED: "已截止",
  OPENED: "已开标",
  EVALUATING: "评标中",
  AWARDED: "已定标",
  ANNOUNCED: "已公示",
};
