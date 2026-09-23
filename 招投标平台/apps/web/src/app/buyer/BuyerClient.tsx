"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProjectStatus } from "@/lib/constants";

type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  bidDeadline: string | null;
  _count: { bids: number; files: number };
};

export default function BuyerClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/projects");
    if (!res.ok) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    setProjects(data.projects || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const body: Record<string, string> = { title, description };
    if (deadline) body.bidDeadline = new Date(deadline).toISOString();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "创建失败");
      return;
    }
    window.location.href = `/buyer/projects/${data.project.id}`;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">招标人工作台</h1>
        <p className="mt-1 text-sm text-slate-500">创建、发布、开标、评标、公示</p>
      </div>

      <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-medium">新建招标项目</h2>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="项目名称"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="公告摘要"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="block text-sm text-slate-600">
          投标截止时间
          <input
            type="datetime-local"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">
          创建草稿
        </button>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </form>

      <div className="space-y-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/buyer/projects/${p.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  文件 {p._count.files} · 投标 {p._count.bids}
                  {p.bidDeadline && ` · 截止 ${new Date(p.bidDeadline).toLocaleString()}`}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-sm text-slate-500">暂无项目</p>}
      </div>
    </div>
  );
}
