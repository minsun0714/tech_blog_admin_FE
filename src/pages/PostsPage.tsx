import PostList from "@/features/post/components/PostList";

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">게시글 열람</h2>
        <p className="text-sm text-slate-500">카테고리 또는 시리즈 기준으로 게시글을 조회합니다.</p>
      </div>
      <PostList />
    </div>
  );
}
