import { FormEvent, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { API_KEY_SESSION_STORAGE_KEY } from "@/lib/http";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", end: true },
  { to: "/posts", label: "게시글 열람" },
  { to: "/tags", label: "태그 관리" },
  { to: "/categories", label: "카테고리 관리" },
  { to: "/series", label: "시리즈 관리" },
];

export default function RootLayout() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setApiKey(sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY) ?? "");
  }, []);

  const handleApiKeySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedApiKey = apiKey.trim();

    if (trimmedApiKey) {
      sessionStorage.setItem(API_KEY_SESSION_STORAGE_KEY, trimmedApiKey);
      setApiKey(trimmedApiKey);
      return;
    }

    sessionStorage.removeItem(API_KEY_SESSION_STORAGE_KEY);
    setApiKey("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <aside className="w-56 shrink-0 border-r border-violet-100 bg-white px-4 py-8 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Tech Blog
        </p>
        <p className="mb-8 text-lg font-bold text-slate-900">Admin</p>
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "block rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-6 flex justify-end">
          <form
            onSubmit={handleApiKeySubmit}
            className="flex w-full max-w-xl items-end gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"
          >
            <label className="flex-1 space-y-1 text-sm text-slate-600">
              <span>X-API-KEY</span>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                type="password"
                placeholder="API 키를 입력하세요"
                className="h-10 w-full rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
              />
            </label>
            <Button type="submit">{apiKey.trim() ? "저장" : "초기화"}</Button>
          </form>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
