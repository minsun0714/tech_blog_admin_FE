import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/features/post/post-api";

interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <Link to={`/posts/${post.postId}/edit`} className="font-semibold text-slate-900 hover:text-violet-700">
            {post.title}
          </Link>
          <p className="text-xs text-slate-500">ID {post.postId}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-rose-200 text-rose-600 hover:bg-rose-50"
          onClick={onDelete}
        >
          삭제
        </Button>
      </CardContent>
    </Card>
  );
}
