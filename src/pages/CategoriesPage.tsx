import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Category,
  changeCategoryParent,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategoryName,
} from "@/components/category/category-api";

const CATEGORY_QUERY_KEY = ["categories"];

function CategoryTreeItem({
  category,
  onUpdateName,
  onChangeParent,
  onDelete,
  updatingCategoryId,
  changingParentCategoryId,
  deletingCategoryId,
}: {
  category: Category;
  onUpdateName: (id: number, name: string) => void;
  onChangeParent: (id: number, parentId: number | null) => void;
  onDelete: (id: number) => void;
  updatingCategoryId: number | null;
  changingParentCategoryId: number | null;
  deletingCategoryId: number | null;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isParentEditorOpen, setIsParentEditorOpen] = useState(false);
  const [draftName, setDraftName] = useState(category.name);
  const [parentIdInput, setParentIdInput] = useState(category.parentId?.toString() ?? "");

  useEffect(() => {
    setDraftName(category.name);
    setParentIdInput(category.parentId?.toString() ?? "");
  }, [category.name, category.parentId]);

  const isUpdatingName = updatingCategoryId === category.id;
  const isChangingParent = changingParentCategoryId === category.id;
  const isDeleting = deletingCategoryId === category.id;

  const submitName = () => {
    const trimmedName = draftName.trim();

    if (!trimmedName) {
      setDraftName(category.name);
      setIsEditingName(false);
      return;
    }

    if (trimmedName !== category.name) {
      onUpdateName(category.id, trimmedName);
    }

    setIsEditingName(false);
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setDraftName(category.name);
      setIsEditingName(false);
    }
  };

  const handleParentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedParentId = parentIdInput.trim();

    if (normalizedParentId && !/^\d+$/.test(normalizedParentId)) {
      return;
    }

    onChangeParent(category.id, normalizedParentId ? Number.parseInt(normalizedParentId, 10) : null);
    setIsParentEditorOpen(false);
  };

  return (
    <li className="space-y-3">
      <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {isEditingName ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitName();
                }}
              >
                <Badge className="px-2 py-1">
                  <input
                    value={draftName}
                    autoFocus
                    onChange={(event) => setDraftName(event.target.value)}
                    onBlur={submitName}
                    onKeyDown={handleNameKeyDown}
                    className="min-w-28 bg-transparent text-xs font-semibold text-violet-800 outline-none"
                  />
                </Badge>
              </form>
            ) : (
              <Badge
                className="cursor-text select-none"
                onDoubleClick={() => {
                  if (!isUpdatingName) {
                    setIsEditingName(true);
                  }
                }}
                title="더블클릭해서 이름 수정"
              >
                {isUpdatingName ? "수정 중..." : category.name}
              </Badge>
            )}
            <span className="text-xs text-slate-400">ID {category.id}</span>
            <span className="text-xs text-slate-400">
              부모 {category.parentId === null ? "없음" : `ID ${category.parentId}`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsParentEditorOpen((current) => !current)}
              disabled={isChangingParent || isDeleting}
            >
              부모 변경
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => {
                if (window.confirm(`"${category.name}" 카테고리를 삭제할까요?`)) {
                  onDelete(category.id);
                }
              }}
              disabled={isDeleting || isChangingParent}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        </div>

        {isParentEditorOpen ? (
          <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleParentSubmit}>
            <input
              value={parentIdInput}
              onChange={(event) => setParentIdInput(event.target.value)}
              className="h-9 rounded-xl border border-violet-100 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
              placeholder="부모 ID 비우면 루트"
              inputMode="numeric"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isChangingParent}>
                {isChangingParent ? "변경 중..." : "저장"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setParentIdInput(category.parentId?.toString() ?? "");
                  setIsParentEditorOpen(false);
                }}
              >
                취소
              </Button>
            </div>
          </form>
        ) : null}
      </div>

      {category.children.length > 0 ? (
        <ul className="ml-4 space-y-3 border-l border-violet-100 pl-4">
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              onUpdateName={onUpdateName}
              onChangeParent={onChangeParent}
              onDelete={onDelete}
              updatingCategoryId={updatingCategoryId}
              changingParentCategoryId={changingParentCategoryId}
              deletingCategoryId={deletingCategoryId}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      setName("");
      setParentId("");
      setFeedback("카테고리를 생성했습니다.");
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: () => {
      setFeedback("카테고리 생성에 실패했습니다.");
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: ({ id, name: nextName }: { id: number; name: string }) => updateCategoryName(id, nextName),
    onSuccess: async () => {
      setFeedback("카테고리 이름을 수정했습니다.");
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: () => {
      setFeedback("카테고리 이름 수정에 실패했습니다.");
    },
  });

  const changeParentMutation = useMutation({
    mutationFn: ({ id, parentId: nextParentId }: { id: number; parentId: number | null }) =>
      changeCategoryParent(id, nextParentId),
    onSuccess: async () => {
      setFeedback("카테고리 부모를 변경했습니다.");
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: () => {
      setFeedback("카테고리 부모 변경에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      setFeedback("카테고리를 삭제했습니다.");
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
    onError: () => {
      setFeedback("카테고리 삭제에 실패했습니다.");
    },
  });

  const updatingCategoryId = updateNameMutation.isPending ? updateNameMutation.variables?.id : null;
  const changingParentCategoryId = changeParentMutation.isPending
    ? changeParentMutation.variables?.id
    : null;
  const deletingCategoryId = deleteMutation.isPending ? deleteMutation.variables ?? null : null;

  const handleCreateCategory = (event: FormEvent<HTMLFormElement>) => {
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
    createMutation.mutate({
      name: trimmedName,
      parentId: normalizedParentId ? Number.parseInt(normalizedParentId, 10) : null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">카테고리 관리</h2>
        <p className="text-sm text-slate-500">카테고리를 생성하고, 이름/부모/삭제 작업을 관리합니다.</p>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">카테고리 생성</h3>
          <p className="text-sm text-slate-500">부모 ID를 비우면 루트 카테고리로 생성됩니다.</p>
        </div>

        <form className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]" onSubmit={handleCreateCategory}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            placeholder="카테고리 이름"
          />
          <input
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            className="h-10 rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            placeholder="부모 ID (선택)"
            inputMode="numeric"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "생성 중..." : "카테고리 생성"}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">카테고리 목록</h3>
          <p className="text-sm text-slate-500">chip을 더블클릭하면 이름을 바로 수정할 수 있습니다.</p>
        </div>

        <div className="mt-4 space-y-4">
          {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}

          {categoriesQuery.isLoading ? <p className="text-sm text-slate-400">카테고리를 불러오는 중입니다.</p> : null}

          {categoriesQuery.isError ? (
            <p className="text-sm text-rose-500">카테고리 목록을 불러오지 못했습니다.</p>
          ) : null}

          {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
            <ul className="space-y-3">
              {categoriesQuery.data.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  onUpdateName={(id, nextName) => updateNameMutation.mutate({ id, name: nextName })}
                  onChangeParent={(id, nextParentId) =>
                    changeParentMutation.mutate({ id, parentId: nextParentId })
                  }
                  onDelete={(id) => deleteMutation.mutate(id)}
                  updatingCategoryId={updatingCategoryId}
                  changingParentCategoryId={changingParentCategoryId}
                  deletingCategoryId={deletingCategoryId}
                />
              ))}
            </ul>
          ) : null}

          {categoriesQuery.data && categoriesQuery.data.length === 0 ? (
            <p className="text-sm text-slate-400">카테고리가 없습니다.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
