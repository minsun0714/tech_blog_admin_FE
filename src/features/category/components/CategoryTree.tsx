import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryNode from "@/features/category/components/CategoryNode";
import { CategoryDndProvider, useCategoryDnd } from "@/features/category/components/CategoryDndProvider";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";
import { cn } from "@/lib/utils";

function RootDropZone() {
  const { draggedId, dropTargetId, setDropTargetId, onDrop } = useCategoryDnd();

  if (!draggedId) return null;

  const isActive = dropTargetId === "root";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDropTargetId("root");
      }}
      onDragLeave={() => setDropTargetId(null)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(null);
      }}
      className={cn(
        "rounded-xl border-2 border-dashed p-3 text-center text-sm transition-colors",
        isActive ? "border-violet-400 bg-violet-50 text-violet-600" : "border-violet-200 text-slate-400",
      )}
    >
      여기에 드롭하면 최상위 카테고리로 변경됩니다
    </div>
  );
}

function CategoryTreeContent() {
  const { data, isLoading, isError } = useCategoriesQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 트리</CardTitle>
        <CardDescription>카테고리를 드래그해 부모 카테고리를 변경합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-slate-400">카테고리를 불러오는 중입니다.</p> : null}
        {isError ? <p className="text-sm text-rose-500">카테고리를 불러오지 못했습니다.</p> : null}
        {data?.length ? (
          <div className="space-y-3">
            {data.map((category) => (
              <CategoryNode key={category.categoryId} category={category} />
            ))}
            <RootDropZone />
          </div>
        ) : (
          <p className="text-sm text-slate-400">카테고리가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CategoryTree() {
  return (
    <CategoryDndProvider>
      <CategoryTreeContent />
    </CategoryDndProvider>
  );
}

