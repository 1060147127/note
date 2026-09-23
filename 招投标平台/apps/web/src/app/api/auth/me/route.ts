import { requireUser } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk({ user });
  } catch (err) {
    return handleApiError(err);
  }
}
