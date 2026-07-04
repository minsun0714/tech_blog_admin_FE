import { Button } from "@/components/ui/Button";

interface PostFormActionsProps {
  onDraft: () => void;
  onPublish: () => void;
  isDraftPending: boolean;
  isPublishPending: boolean;
  message: string | null;
  currentPostId: number | null;
}

export default function PostFormActions({
  onDraft,
  onPublish,
  isDraftPending,
  isPublishPending,
  message,
  currentPostId,
}: PostFormActionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void onDraft()} disabled={isDraftPending}>
          {isDraftPending ? "저장 중..." : "임시저장"}
        </Button>
        <Button variant="outline" onClick={() => void onPublish()} disabled={isPublishPending}>
          {isPublishPending ? "처리 중..." : "발행"}
        </Button>
      </div>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      {currentPostId ? <p className="text-xs text-slate-400">현재 임시 게시물 ID: {currentPostId}</p> : null}
    </div>
  );
}
