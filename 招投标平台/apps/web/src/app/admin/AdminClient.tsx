"use client";

import { FormEvent, useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  role: string;
  orgName: string;
  createdAt: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<"BUYER" | "BIDDER">("BIDDER");
  const [orgName, setOrgName] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users");
    if (res.status === 401 || res.status === 403) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, orgName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "创建失败");
      return;
    }
    setEmail("");
    setOrgName("");
    setMsg("已创建");
    load();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">管理员控制台</h1>
        <p className="mt-1 text-sm text-slate-500">开户与用户列表</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-medium">创建账号</h2>
        <input
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="单位名称"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
        />
        <input
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="rounded border border-slate-300 px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value as "BUYER" | "BIDDER")}
        >
          <option value="BUYER">招标人</option>
          <option value="BIDDER">投标人</option>
        </select>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">
          创建
        </button>
        {msg && <p className="md:col-span-2 text-sm text-slate-600">{msg}</p>}
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">邮箱</th>
              <th className="px-4 py-3">单位</th>
              <th className="px-4 py-3">角色</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.orgName}</td>
                <td className="px-4 py-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
