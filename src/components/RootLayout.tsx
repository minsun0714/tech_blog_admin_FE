import { NavLink, Outlet } from "react-router-dom";
import MainHeader from "@/components/layout/MainHeader";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", end: true },
  { to: "/posts", label: "게시글 열람" },
  { to: "/tags", label: "태그 관리" },
  { to: "/categories", label: "카테고리 관리" },
  { to: "/series", label: "시리즈 관리" },
];

export default function RootLayout() {
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
        <MainHeader />
        <Outlet />
      </main>
    </div>
  );
}
