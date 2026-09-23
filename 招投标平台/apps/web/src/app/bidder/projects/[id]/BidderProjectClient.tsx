"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProjectStatus } from "@/lib/constants";

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  bidDeadline: string | null;
  scoringRules: string;
  files: { id: string; filename: string }[];
  bids: { id: string; status: string; files: { id: string; filename: string }[] }[];
  announcement?: { content: string } | null;
};

export default function BidderProjectClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "加载失败");
      return;
    }
    setProject(data.project);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitBid(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${id}/bids`, { method: "POST", body: fd });
    const data = await res.json();
    setMsg(res.ok ? "投标已提交" : data.error);
    if (res.ok) {
      e.currentTarget.reset();
      load();
    }
  }

  async function withdraw(bidId: string) {
    const res = await fetch(`/api/bids/${bidId}/withdraw`, { method: "POST" });
    const data = await res.json();
    setMsg(res.ok ? "已撤回，可重新上传" : data.error);
    if (res.ok) load();
  }

  if (!project) {
    return <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">{msg || "加载中…"}</div>;
  }

  const myBid = project.bids[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Link href="/bidder" className="text-sm text-slate-500 underline">
        ← 返回大厅
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{project.description}</p>
          <p className="mt-2 text-xs text-slate-500">
            评分办法：{project.scoringRules}
            {project.bidDeadline && ` · 截止 ${new Date(project.bidDeadline).toLocaleString()}`}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-medium">招标文件</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {project.files.map((f) => (
            <li key={f.id}>
              <a className="underline" href={`/api/projects/${id}/files/${f.id}/download`}>
                {f.filename}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {project.status === "BIDDING" && (
        <div className="space-y-3 rounded-xl border bg-white p-6">
          <h2 className="font-medium">提交投标</h2>
          {myBid?.status === "SUBMITTED" ? (
            <div>
              <p className="text-sm">已提交：{myBid.files.map((f) => f.filename).join(", ")}</p>
              <button onClick={() => withdraw(myBid.id)} className="mt-3 rounded border px-4 py-2">
                撤回
              </button>
            </div>
          ) : (
            <form onSubmit={submitBid} className="space-y-3">
              <input name="file" type="file" required />
              <button className="rounded bg-slate-900 px-4 py-2 text-white">提交投标文件</button>
            </form>
          )}
        </div>
      )}

      {project.announcement && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 whitespace-pre-wrap">
          <h2 className="font-medium">公示</h2>
          <p className="mt-2 text-sm">{project.announcement.content}</p>
        </div>
      )}
    </div>
  );
}
