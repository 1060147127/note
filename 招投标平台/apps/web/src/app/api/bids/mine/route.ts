import { Role } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const user = await requireUser([Role.BIDDER]);
    const bids = await prisma.bid.findMany({
      where: { bidderId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            bidDeadline: true,
            announcement: true,
          },
        },
        files: true,
        evaluation: true,
      },
    });
    return jsonOk({ bids });
  } catch (err) {
    return handleApiError(err);
  }
}
