import { STATUS_LABEL } from "@/lib/project-status";
import type { ProjectStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const colors: Record<ProjectStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    BIDDING: "bg-emerald-100 text-emerald-800",
    CLOSED: "bg-amber-100 text-amber-800",
    OPENED: "bg-sky-100 text-sky-800",
    EVALUATING: "bg-indigo-100 text-indigo-800",
    AWARDED: "bg-violet-100 text-violet-800",
    ANNOUNCED: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colors[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
