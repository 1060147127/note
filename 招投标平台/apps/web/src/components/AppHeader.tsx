import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { homeForRole } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={homeForRole(user.role)} className="text-lg font-semibold tracking-tight text-slate-900">
          招投标平台
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>
            {user.orgName} · {user.email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
