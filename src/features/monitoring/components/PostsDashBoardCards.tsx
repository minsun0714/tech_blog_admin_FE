import { usePostCountQuery } from "@/features/post/hooks/use-posts";
import { Link } from "react-router-dom";

export default function PostsDashBoardCards() {
  const { data: postCount } = usePostCountQuery();

  const SUMMARY_CARDS = [
    {
      title: "저장된 게시글",
      description: "저장된 게시글 목록을 확인하고 새 게시물을 작성합니다.",
      to: "/posts?publishStatus=PUBLISHED",
      count: postCount?.publishedPostCount,
      unit: "편",
    },
    {
      title: "임시저장된 게시글",
      description: "임시저장된 게시글 목록을 확인하고 이어서 작성합니다.",
      to: "/posts?publishStatus=DRAFTED",
      count: postCount?.draftedPostCount,
      unit: "편",
    },
  ];
  return (
    <div className="flex w-full gap-6 flex-wrap">
      {SUMMARY_CARDS.map(({ title, description, to, count, unit }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col w-full gap-3 rounded-2xl border border-violet-100 bg-white p-6 transition hover:border-violet-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-violet-700">
              {title}
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {count}
              <span className="ml-0.5 text-sm font-medium text-slate-400">
                {unit}
              </span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 group-hover:text-slate-700">
            {description}
          </p>
        </Link>
      ))}
    </div>
  );
}
