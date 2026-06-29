import { Link } from "react-router-dom";

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">게시글 열람</h2>
          <p className="text-sm text-slate-500">작성된 게시글 목록을 확인합니다.</p>
        </div>
        <Link
          to="/posts/new"
          className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          게시물 작성
        </Link>
      </div>
      <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-400">게시글이 없습니다.</p>
      </div>
    </div>
  );
}
