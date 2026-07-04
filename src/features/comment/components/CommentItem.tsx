import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import type { CommentNode } from "@/features/comment/comment-api";
import CommentForm from "@/features/comment/components/CommentForm";
import {
  useCreateReplyCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/features/comment/hooks/use-comments";

interface CommentItemProps {
  comment: CommentNode;
  postId: number;
  depth?: number;
}

export default function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const replyMutation = useCreateReplyCommentMutation(postId);
  const deleteMutation = useDeleteCommentMutation(postId);
  const updateMutation = useUpdateCommentMutation(postId);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await updateMutation.mutateAsync({ id: comment.commentId, content: trimmedContent });
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 rounded-xl border border-violet-100 bg-white p-4" style={{ marginLeft: depth * 16 }}>
      {isEditing ? (
        <form className="flex gap-2" onSubmit={handleUpdate}>
          <Input value={content} onChange={(event) => setContent(event.target.value)} />
          <Button size="sm" type="submit">저장</Button>
        </form>
      ) : (
        <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "취소" : "수정"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-rose-200 text-rose-600 hover:bg-rose-50"
          onClick={() => void deleteMutation.mutateAsync(comment.commentId)}
        >
          삭제
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsReplying((prev) => !prev)}>
          {isReplying ? "닫기" : "대댓글 달기"}
        </Button>
      </div>

      {isReplying ? (
        <CommentForm
          isReply
          onSubmit={async (replyContent) => {
            await replyMutation.mutateAsync({ commentId: comment.commentId, content: replyContent });
            setIsReplying(false);
          }}
        />
      ) : null}

      {comment.childrenCommentList.length > 0 ? (
        <div className="space-y-3">
          {comment.childrenCommentList.map((child) => (
            <CommentItem key={child.commentId} comment={child} postId={postId} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
