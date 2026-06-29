import { Link } from "react-router-dom";

const SUMMARY_CARDS = [
  {
    title: "게시글",
    description: "작성된 게시글 목록을 확인하고 새 게시물을 작성합니다.",
    to: "/posts",
    count: 0,
    unit: "편",
  },
  {
    title: "태그",
    description: "게시글에 사용되는 태그를 관리합니다.",
    to: "/tags",
    count: 0,
    unit: "개",
  },
  {
    title: "카테고리",
    description: "게시글을 분류하는 카테고리를 관리합니다.",
    to: "/categories",
    count: 0,
    unit: "개",
  },
  {
    title: "시리즈",
    description: "연재 게시글을 묶는 시리즈를 관리합니다.",
    to: "/series",
    count: 0,
    unit: "개",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">대시보드</h2>
        <p className="text-sm text-slate-500">블로그 관리 현황을 한눈에 확인합니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map(({ title, description, to, count, unit }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-3 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-violet-700">{title}</span>
              <span className="text-2xl font-bold text-slate-900">
                {count}
                <span className="ml-0.5 text-sm font-medium text-slate-400">{unit}</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 group-hover:text-slate-700">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
