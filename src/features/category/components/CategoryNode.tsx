import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import type { CategoryNode as CategoryNodeType } from "@/features/category/category-api";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryNameMutation,
} from "@/features/category/hooks/use-categories";

interface CategoryNodeProps {
  category: CategoryNodeType;
  depth?: number;
}

export default function CategoryNode({ category, depth = 0 }: CategoryNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.categoryName);
  const updateMutation = useUpdateCategoryNameMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await updateMutation.mutateAsync({ id: category.categoryId, name: trimmedName });
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4" style={{ marginLeft: depth * 16 }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {isEditing ? (
          <form className="flex flex-1 gap-2" onSubmit={handleUpdate}>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <Button size="sm" type="submit" disabled={updateMutation.isPending}>
              저장
            </Button>
          </form>
        ) : (
          <div>
            <p className="font-semibold text-slate-900">{category.categoryName}</p>
            <p className="text-xs text-slate-500">ID {category.categoryId}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? "취소" : "수정"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => void deleteMutation.mutateAsync(category.categoryId)}
          >
            삭제
          </Button>
        </div>
      </div>

      {category.childrenCategoryList.length > 0 ? (
        <div className="space-y-3">
          {category.childrenCategoryList.map((child) => (
            <CategoryNode key={child.categoryId} category={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
