import { NavLink, Outlet } from "react-router-dom";
import MainHeader from "@/components/layout/MainHeader";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", end: true },
  { to: "/posts", label: "게시글 열람" },
  { to: "/tags", label: "태그 관리" },
  { to: "/categories", label: "카테고리 관리" },
  { to: "/series", label: "시리즈 관리" },
];

export default function RootLayout() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  console.log("isHamburgerOpen", isHamburgerOpen);
  return (
    <div className="flex min-h-screen bg-linear-to-b from-violet-50 to-white">
      <aside
        className={cn(
          "max-w-120 shrink-0 border-r border-violet-100 bg-white px-4 py-8 shadow-sm",
          isHamburgerOpen
            ? "w-1/2 min-w-80 absolute z-80 h-full"
            : "w-0 overflow-hidden px-0",
          "md:block",
        )}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
              Tech Blog
            </p>
            <p className="mb-8 text-lg font-bold text-slate-900">Admin</p>
          </div>
          <button onClick={() => setIsHamburgerOpen(false)}>
            <X color="black" size={20} />
          </button>
        </div>
        <nav className="flex flex-col items-start gap-2">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <button onClick={() => setIsHamburgerOpen(false)} className="w-full " key={to}>
              <NavLink
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
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-full">
        <MainHeader
          isHamburgerOpen={isHamburgerOpen}
          setIsHamburgerOpen={setIsHamburgerOpen}
        />
        <Outlet />
      </main>
    </div>
  );
}
