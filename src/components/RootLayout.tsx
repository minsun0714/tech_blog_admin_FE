import { NavLink, Outlet } from "react-router-dom";
import MainHeader from "@/components/layout/MainHeader";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isHamburgerOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsHamburgerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isHamburgerOpen]);

  return (
    <div className="flex min-h-screen min-w-0 bg-linear-to-b from-violet-50 to-white">
      {isHamburgerOpen ? (
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-[90] bg-slate-950/25 backdrop-blur-[1px]"
          onClick={() => setIsHamburgerOpen(false)}
        />
      ) : null}
      <aside
        id="admin-sidebar"
        aria-hidden={!isHamburgerOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-[100] w-72 shrink-0 overflow-y-auto border-r border-violet-100 bg-white px-4 py-8 shadow-lg transition-[transform,visibility] duration-200",
          isHamburgerOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full",
        )}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
              Tech Blog
            </p>
            <p className="mb-8 text-lg font-bold text-slate-900">Admin</p>
          </div>
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="rounded-lg p-2 hover:bg-violet-50"
            onClick={() => setIsHamburgerOpen(false)}
          >
            <X color="black" size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center pb-12">
          <img
            src="/jasmine.svg"
            alt="jasmine"
            className="w-1/2 rounded-2xl "
          />
        </div>
        <nav className="flex flex-col items-start gap-2">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              to={to}
              end={end}
              onClick={() => setIsHamburgerOpen(false)}
              key={to}
              className={({ isActive }) =>
                [
                  "block w-full rounded-xl px-4 py-2.5 text-sm font-medium transition",
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

      <main className="min-w-0 max-w-full flex-1 p-4 sm:p-6 lg:p-8">
        <MainHeader
          isHamburgerOpen={isHamburgerOpen}
          setIsHamburgerOpen={setIsHamburgerOpen}
        />
        <Outlet />
      </main>
    </div>
  );
}
