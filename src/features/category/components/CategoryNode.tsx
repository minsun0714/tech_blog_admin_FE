import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import type { CategoryNode as CategoryNodeType } from "@/features/category/category-api";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryNameMutation,
} from "@/features/category/hooks/use-categories";
import { useCategoryDnd } from "@/features/category/components/CategoryDndProvider";
import { cn } from "@/lib/utils";

interface CategoryNodeProps {
  category: CategoryNodeType;
  depth?: number;
}

export default function CategoryNode({
  category,
  depth = 0,
}: CategoryNodeProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.categoryName);
  const updateMutation = useUpdateCategoryNameMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const {
    draggedId,
    dropTargetId,
    setDropTargetId,
    onDragStart,
    onDragEnd,
    onDrop,
  } = useCategoryDnd();

  const isDragging = draggedId === category.categoryId;
  const isDropTarget = dropTargetId === category.categoryId;

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await updateMutation.mutateAsync({
      id: category.categoryId,
      name: trimmedName,
    });
    setIsEditing(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(category.categoryId);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(category.categoryId);
      }}
      onDragLeave={(e) => {
        if (
          e.relatedTarget &&
          !e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          setDropTargetId(null);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(category.categoryId);
      }}
      className={cn(
        "space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 transition-all",
        isDragging && "opacity-40",
        isDropTarget &&
          !isDragging &&
          "border-violet-400 bg-violet-100 ring-2 ring-violet-300",
      )}
      style={{ marginLeft: depth * 16 }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {isEditing ? (
          <form className="flex flex-1 gap-2" onSubmit={handleUpdate}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button size="sm" type="submit" disabled={updateMutation.isPending}>
              저장
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {category.categoryName}
                </p>
              </div>
              <p className="text-xs text-slate-500">ID {category.categoryId}</p>
            </div>
          </div>
        )}

        <div className="flex gap-10">
          <Button
            className="cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-50"
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/posts?type=category&value=${category.categoryId}`)
            }
          >
            게시물 보기
          </Button>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() =>
                void deleteMutation.mutateAsync(category.categoryId)
              }
            >
              삭제
            </Button>
          </div>
        </div>
      </div>

      {category.childrenCategoryList.length > 0 ? (
        <div className="space-y-3">
          {category.childrenCategoryList.map((child) => (
            <CategoryNode
              key={child.categoryId}
              category={child}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
