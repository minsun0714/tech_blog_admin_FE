import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { createCategory } from "@/components/category/category-api";
import CategoryTextField from "@/components/category/CategoryTextField";

export default function CategoryCreateForm() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      setName("");
      setParentId("");
      setFeedback("카테고리를 생성했습니다.");
      // 모달을 닫는다.
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      setFeedback("카테고리 생성에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const normalizedParentId = parentId.trim();

    if (!trimmedName) {
      setFeedback("카테고리 이름을 입력해주세요.");
      return;
    }

    if (normalizedParentId && !/^\d+$/.test(normalizedParentId)) {
      setFeedback("부모 ID는 숫자로 입력해주세요.");
      return;
    }

    setFeedback(null);
    mutation.mutate({
      name: trimmedName,
      parentId: normalizedParentId
        ? Number.parseInt(normalizedParentId, 10)
        : null,
    });
  };

  return (
    <form
      className="flex justify-end items-end space-x-2"
      onSubmit={handleSubmit}
    >
      <CategoryTextField
        label="카테고리 이름"
        value={name}
        onChange={setName}
        placeholder="예: 백엔드"
      />
      <CategoryTextField
        label="부모 ID (선택)"
        value={parentId}
        onChange={setParentId}
        placeholder="예: 1"
        inputMode="numeric"
      />
      <Button
        className="p-5"
        size="lg"
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "생성 중..." : "카테고리 생성"}
      </Button>
    </form>
  );
}
