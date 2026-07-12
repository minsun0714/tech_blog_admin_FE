import { Button } from "@/components/ui/Button";

interface PostFormActionsProps {
  cardTitle: string;
  onPublish: () => void;
  isPublishPending: boolean;
  message: string | null;
}

export default function PostFormActions({
  cardTitle,
  onPublish,
  isPublishPending,
  message,
}: PostFormActionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={onPublish}
          disabled={isPublishPending}
        >
          {isPublishPending ? "처리 중..." : cardTitle}
        </Button>
      </div>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
