"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProjectStatus } from "@/lib/constants";

type FileRow = { id: string; filename: string; hash: string };
type BidRow = {
  id: string;
  status: string;
  bidder: { orgName: string; email: string };
  files: FileRow[];
  evaluation?: { score: number; isWinner: boolean; comment: string } | null;
};

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  bidDeadline: string | null;
  scoringRules: string;
  openSnapshot: string | null;
  files: FileRow[];
  bids: BidRow[];
  announcement?: { content: string } | null;
};

export default function BuyerProjectClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [msg, setMsg] = useState("");
  const [scores, setScores] = useState<Record<string, { score: string; comment: string; isWinner: boolean }>>({});
  const [announce, setAnnounce] = useState("现将本项目中标结果予以公示。");

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "加载失败");
      return;
    }
    setProject(data.project);
    const init: typeof scores = {};
    for (const b of data.project.bids || []) {
      init[b.id] = {
        score: b.evaluation?.score?.toString() || "80",
        comment: b.evaluation?.comment || "",
        isWinner: !!b.evaluation?.isWinner,
      };
    }
    setScores(init);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function uploadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await fetch(`/api/projects/${id}/files`, { method: "POST", body: fd });
    const data = await res.json();
    setMsg(res.ok ? "上传成功" : data.error);
    if (res.ok) {
      form.reset();
      load();
    }
  }

  async function saveMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const deadline = String(fd.get("bidDeadline") || "");
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        scoringRules: fd.get("scoringRules"),
        bidDeadline: deadline ? new Date(deadline).toISOString() : null,
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? "已保存" : data.error);
    if (res.ok) load();
  }

  async function act(path: string, body?: unknown) {
    const res = await fetch(`/api/projects/${id}/${path}`, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    setMsg(res.ok ? "操作成功" : data.error || "失败");
    if (res.ok) load();
  }

  if (!project) {
    return <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">{msg || "加载中…"}</div>;
  }

  const submitted = project.bids.filter((b) => b.status === "SUBMITTED");

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}

      {project.status === "DRAFT" && (
        <>
          <form onSubmit={saveMeta} className="space-y-3 rounded-xl border bg-white p-6">
            <h2 className="font-medium">编辑草稿</h2>
            <input name="title" defaultValue={project.title} className="w-full rounded border px-3 py-2" />
            <textarea name="description" defaultValue={project.description} className="w-full rounded border px-3 py-2" rows={3} />
            <input name="scoringRules" defaultValue={project.scoringRules} className="w-full rounded border px-3 py-2" />
            <input
              name="bidDeadline"
              type="datetime-local"
              defaultValue={
                project.bidDeadline
                  ? new Date(project.bidDeadline).toISOString().slice(0, 16)
                  : ""
              }
              className="w-full rounded border px-3 py-2"
            />
            <button className="rounded bg-slate-900 px-4 py-2 text-white">保存</button>
          </form>
          <form onSubmit={uploadFile} className="space-y-3 rounded-xl border bg-white p-6">
            <h2 className="font-medium">上传招标文件</h2>
            <input name="file" type="file" required />
            <button className="rounded border px-4 py-2">上传</button>
            <ul className="text-sm text-slate-600">
              {project.files.map((f) => (
                <li key={f.id}>
                  <a className="underline" href={`/api/projects/${id}/files/${f.id}/download`}>
                    {f.filename}
                  </a>
                </li>
              ))}
            </ul>
          </form>
          <button onClick={() => act("publish")} className="rounded bg-emerald-700 px-4 py-2 text-white">
            发布项目
          </button>
        </>
      )}

      {project.status === "CLOSED" && (
        <button onClick={() => act("open")} className="rounded bg-sky-700 px-4 py-2 text-white">
          开标（固化快照）
        </button>
      )}

      {(project.status === "OPENED" || project.status === "EVALUATING") && (
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-medium">评标定标</h2>
          {submitted.map((b) => (
            <div key={b.id} className="border-t border-slate-100 pt-3">
              <div className="font-medium">
                {b.bidder.orgName}（{b.bidder.email}）
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {b.files.map((f) => (
                  <a key={f.id} className="mr-3 underline" href={`/api/bids/${b.id}/files/${f.id}/download`}>
                    {f.filename}
                  </a>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <input
                  type="number"
                  className="w-24 rounded border px-2 py-1"
                  value={scores[b.id]?.score || ""}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, [b.id]: { ...s[b.id], score: e.target.value } }))
                  }
                />
                <input
                  className="flex-1 rounded border px-2 py-1"
                  placeholder="评语"
                  value={scores[b.id]?.comment || ""}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, [b.id]: { ...s[b.id], comment: e.target.value } }))
                  }
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="winner"
                    checked={!!scores[b.id]?.isWinner}
                    onChange={() => {
                      const next: typeof scores = {};
                      for (const x of submitted) {
                        next[x.id] = {
                          score: scores[x.id]?.score || "80",
                          comment: scores[x.id]?.comment || "",
                          isWinner: x.id === b.id,
                        };
                      }
                      setScores(next);
                    }}
                  />
                  中标
                </label>
              </div>
            </div>
          ))}
          <button
            className="rounded bg-violet-700 px-4 py-2 text-white"
            onClick={() =>
              act("evaluate", {
                evaluations: submitted.map((b) => ({
                  bidId: b.id,
                  score: Number(scores[b.id]?.score || 0),
                  comment: scores[b.id]?.comment || "",
                  isWinner: !!scores[b.id]?.isWinner,
                })),
              })
            }
          >
            提交评分并定标
          </button>
        </div>
      )}

      {project.status === "AWARDED" && (
        <div className="space-y-3 rounded-xl border bg-white p-6">
          <h2 className="font-medium">发布公示</h2>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={4}
            value={announce}
            onChange={(e) => setAnnounce(e.target.value)}
          />
          <button
            className="rounded bg-rose-700 px-4 py-2 text-white"
            onClick={() => act("announce", { content: announce })}
          >
            发布公示
          </button>
        </div>
      )}

      {project.openSnapshot && (
        <pre className="overflow-auto rounded-xl border bg-slate-900 p-4 text-xs text-slate-100">
          {JSON.stringify(JSON.parse(project.openSnapshot), null, 2)}
        </pre>
      )}

      {project.announcement && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 whitespace-pre-wrap">
          <h2 className="font-medium">公示内容</h2>
          <p className="mt-2 text-sm">{project.announcement.content}</p>
        </div>
      )}
    </div>
  );
}
