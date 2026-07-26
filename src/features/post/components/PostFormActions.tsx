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
      <div className="flex items-center justify-end gap-3">
        {message ? (
          <p className="mr-auto text-sm text-slate-500">{message}</p>
        ) : null}
        <Button
          size="lg"
          onClick={onPublish}
          disabled={isPublishPending}
          className="min-w-32"
        >
          {isPublishPending ? "처리 중..." : cardTitle}
        </Button>
      </div>
    </div>
  );
}
