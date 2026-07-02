import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { changeCategoryParent } from "@/components/category/category-api";
import CategoryFormCard from "@/components/category/CategoryFormCard";
import CategoryTextField from "@/components/category/CategoryTextField";

export default function CategoryChangeParentForm() {
  const [id, setId] = useState("");
  const [parentId, setParentId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ categoryId, newParentId }: { categoryId: number; newParentId: number | null }) =>
      changeCategoryParent(categoryId, newParentId),
    onSuccess: () => {
      setId("");
      setParentId("");
      setFeedback("부모 카테고리를 변경했습니다.");
    },
    onError: () => {
      setFeedback("부모 변경에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedId = id.trim();
    const normalizedParentId = parentId.trim();

    if (!/^\d+$/.test(normalizedId)) {
      setFeedback("올바른 카테고리 ID를 입력해주세요.");
      return;
    }

    if (normalizedParentId && !/^\d+$/.test(normalizedParentId)) {
      setFeedback("부모 ID는 숫자로 입력해주세요.");
      return;
    }

    setFeedback(null);
    mutation.mutate({
      categoryId: Number.parseInt(normalizedId, 10),
      newParentId: normalizedParentId ? Number.parseInt(normalizedParentId, 10) : null,
    });
  };

  return (
    <CategoryFormCard
      title="부모 변경"
      description="카테고리의 부모를 변경합니다. 부모 ID를 비우면 루트가 됩니다."
      feedback={feedback}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <CategoryTextField label="카테고리 ID" value={id} onChange={setId} placeholder="예: 3" inputMode="numeric" />
        <CategoryTextField
          label="새 부모 ID (비우면 루트)"
          value={parentId}
          onChange={setParentId}
          placeholder="예: 1"
          inputMode="numeric"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "변경 중..." : "부모 변경"}
        </Button>
      </form>
    </CategoryFormCard>
  );
}
