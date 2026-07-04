import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryNode from "@/features/category/components/CategoryNode";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";

export default function CategoryTree() {
  const { data, isLoading, isError } = useCategoriesQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 트리</CardTitle>
        <CardDescription>카테고리 계층 구조를 확인하고 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-slate-400">카테고리를 불러오는 중입니다.</p> : null}
        {isError ? <p className="text-sm text-rose-500">카테고리를 불러오지 못했습니다.</p> : null}
        {!isLoading && !isError && (!data || data.length === 0) ? (
          <p className="text-sm text-slate-400">카테고리가 없습니다.</p>
        ) : null}
        {!isLoading && !isError && data?.length ? (
          <div className="space-y-3">
            {data.map((category) => (
              <CategoryNode key={category.categoryId} category={category} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
