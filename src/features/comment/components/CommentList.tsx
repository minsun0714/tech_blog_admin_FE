import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CommentForm from "@/features/comment/components/CommentForm";
import CommentItem from "@/features/comment/components/CommentItem";
import { useCommentsQuery, useCreateRootCommentMutation } from "@/features/comment/hooks/use-comments";

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const { data, isLoading, isError } = useCommentsQuery(postId);
  const createRootMutation = useCreateRootCommentMutation(postId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>댓글</CardTitle>
        <CardDescription>댓글과 대댓글을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommentForm onSubmit={(content) => createRootMutation.mutateAsync(content)} />
        {isLoading ? <p className="text-sm text-slate-400">댓글을 불러오는 중입니다.</p> : null}
        {isError ? <p className="text-sm text-rose-500">댓글을 불러오지 못했습니다.</p> : null}
        {!isLoading && !isError && (!data || data.length === 0) ? (
          <p className="text-sm text-slate-400">댓글이 없습니다.</p>
        ) : null}
        {!isLoading && !isError && data?.length ? (
          <div className="space-y-3">
            {data.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} postId={postId} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
