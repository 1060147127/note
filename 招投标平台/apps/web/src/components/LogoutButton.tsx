"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
    >
      退出
    </button>
  );
}
