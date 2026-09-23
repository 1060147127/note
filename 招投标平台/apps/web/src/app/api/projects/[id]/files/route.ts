import { Role, ProjectStatus } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { saveObject } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const user = await requireUser([Role.BUYER]);
    const { id } = await ctx.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.buyerId !== user.id) return jsonError("无权限", 403);
    if (project.status !== ProjectStatus.DRAFT) return jsonError("仅草稿可上传招标文件", 400);

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("缺少文件");
    const buf = Buffer.from(await file.arrayBuffer());
    const saved = await saveObject(`projects/${id}`, file.name, buf);
    const record = await prisma.projectFile.create({
      data: {
        projectId: id,
        kind: "tender",
        storageKey: saved.storageKey,
        filename: file.name,
        hash: saved.hash,
        size: saved.size,
      },
    });
    return jsonOk({ file: record }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
