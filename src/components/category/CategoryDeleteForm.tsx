import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { deleteCategory } from "@/components/category/category-api";
import CategoryFormCard from "@/components/category/CategoryFormCard";
import CategoryTextField from "@/components/category/CategoryTextField";

export default function CategoryDeleteForm() {
  const [id, setId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      setId("");
      setFeedback("카테고리를 삭제했습니다.");
    },
    onError: () => {
      setFeedback("카테고리 삭제에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedId = id.trim();

    if (!/^\d+$/.test(normalizedId)) {
      setFeedback("올바른 카테고리 ID를 입력해주세요.");
      return;
    }

    setFeedback(null);
    mutation.mutate(Number.parseInt(normalizedId, 10));
  };

  return (
    <CategoryFormCard title="카테고리 삭제" description="카테고리를 삭제합니다." feedback={feedback}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <CategoryTextField label="카테고리 ID" value={id} onChange={setId} placeholder="예: 5" inputMode="numeric" />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
        >
          {mutation.isPending ? "삭제 중..." : "카테고리 삭제"}
        </Button>
      </form>
    </CategoryFormCard>
  );
}
