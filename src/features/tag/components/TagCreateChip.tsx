import { KeyboardEvent, useRef, useState } from "react";
import { Plus } from "lucide-react";
import {
  useFetchTags,
  useCreateTagMutation,
} from "@/features/tag/hooks/use-tags";

export default function TagCreateChip() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = useFetchTags().data || [];
  const createMutation = useCreateTagMutation();

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const trimmedName = value.trim();
    if (!trimmedName) return;

    try {
      await createMutation.mutateAsync(trimmedName);
      setValue("");
    } catch {
      // 생성 실패 시 목록 갱신 없음
    }
  };

  return (
    <div
      className="inline-flex cursor-text items-center gap-1 rounded-full border border-dashed border-violet-300 bg-violet-50 px-3 py-1 text-xs text-violet-600"
      onClick={() => inputRef.current?.focus()}
    >
      <Plus className="h-3 w-3 shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => void handleKeyDown(e)}
        placeholder="태그 추가"
        disabled={createMutation.isPending}
        className="w-16 min-w-0 bg-transparent outline-none placeholder:text-violet-400"
        aria-label="새 태그 이름"
      />
    </div>
  );
}
