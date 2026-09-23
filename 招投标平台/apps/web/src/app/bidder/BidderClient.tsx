"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProjectStatus } from "@/lib/constants";

type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  bidDeadline: string | null;
  buyer: { orgName: string };
  bids?: { id: string; status: string }[];
};

export default function BidderClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<
    {
      id: string;
      status: string;
      project: { id: string; title: string; status: ProjectStatus; announcement?: { content: string } | null };
      evaluation?: { isWinner: boolean; score: number } | null;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const [pRes, bRes] = await Promise.all([fetch("/api/projects"), fetch("/api/bids/mine")]);
      if (!pRes.ok) {
        window.location.href = "/login";
        return;
      }
      setProjects((await pRes.json()).projects || []);
      if (bRes.ok) setBids((await bRes.json()).bids || []);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">投标人大厅</h1>
        <p className="mt-1 text-sm text-slate-500">浏览项目、提交投标、查看公示</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">可参与项目</h2>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/bidder/projects/${p.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  招标人 {p.buyer.orgName}
                  {p.bidDeadline && ` · 截止 ${new Date(p.bidDeadline).toLocaleString()}`}
                  {p.bids?.[0] && ` · 我的投标：${p.bids[0].status}`}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">我的投标与结果</h2>
        {bids.map((b) => (
          <div key={b.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{b.project.title}</div>
              <StatusBadge status={b.project.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">投标状态：{b.status}</p>
            {b.evaluation && (
              <p className="mt-1 text-sm">
                得分 {b.evaluation.score}
                {b.evaluation.isWinner ? " · 中标" : " · 未中标"}
              </p>
            )}
            {b.project.announcement && (
              <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">
                {b.project.announcement.content}
              </pre>
            )}
          </div>
        ))}
        {bids.length === 0 && <p className="text-sm text-slate-500">暂无投标记录</p>}
      </section>
    </div>
  );
}
