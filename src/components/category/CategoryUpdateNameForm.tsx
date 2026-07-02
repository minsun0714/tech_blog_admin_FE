import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { updateCategoryName } from "@/components/category/category-api";
import CategoryFormCard from "@/components/category/CategoryFormCard";
import CategoryTextField from "@/components/category/CategoryTextField";

export default function CategoryUpdateNameForm() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ categoryId, categoryName }: { categoryId: number; categoryName: string }) =>
      updateCategoryName(categoryId, categoryName),
    onSuccess: () => {
      setId("");
      setName("");
      setFeedback("카테고리 이름을 수정했습니다.");
    },
    onError: () => {
      setFeedback("카테고리 이름 수정에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedId = id.trim();
    const trimmedName = name.trim();

    if (!/^\d+$/.test(normalizedId)) {
      setFeedback("올바른 카테고리 ID를 입력해주세요.");
      return;
    }

    if (!trimmedName) {
      setFeedback("수정할 이름을 입력해주세요.");
      return;
    }

    setFeedback(null);
    mutation.mutate({ categoryId: Number.parseInt(normalizedId, 10), categoryName: trimmedName });
  };

  return (
    <CategoryFormCard title="이름 수정" description="카테고리 이름을 변경합니다." feedback={feedback}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <CategoryTextField label="카테고리 ID" value={id} onChange={setId} placeholder="예: 1" inputMode="numeric" />
        <CategoryTextField label="새 이름" value={name} onChange={setName} placeholder="예: 백엔드" />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "수정 중..." : "이름 수정"}
        </Button>
      </form>
    </CategoryFormCard>
  );
}
