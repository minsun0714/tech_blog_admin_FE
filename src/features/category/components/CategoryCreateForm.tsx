import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flattenCategories } from "@/features/category/category-api";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
} from "@/features/category/hooks/use-categories";

const ROOT_VALUE = "__root__";

export default function CategoryCreateForm() {
  const [name, setName] = useState("");
  const [parentValue, setParentValue] = useState(ROOT_VALUE);
  const [message, setMessage] = useState<string | null>(null);
  const { data } = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const flatCategories = useMemo(() => flattenCategories(data ?? []), [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("카테고리 이름을 입력해주세요.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        parentId: parentValue === ROOT_VALUE ? null : Number.parseInt(parentValue, 10),
      });
      setName("");
      setParentValue(ROOT_VALUE);
      setMessage("카테고리를 생성했습니다.");
    } catch {
      setMessage("카테고리 생성에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 추가</CardTitle>
        <CardDescription>상위 카테고리를 선택해 새 카테고리를 만듭니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="category-name">이름</Label>
            <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 프론트엔드" />
          </div>
          <div className="space-y-2">
            <Label>부모 카테고리</Label>
            <Select value={parentValue} onValueChange={setParentValue}>
              <SelectTrigger>
                <SelectValue placeholder="최상위 카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROOT_VALUE}>최상위 카테고리</SelectItem>
                {flatCategories.map((category) => (
                  <SelectItem key={category.categoryId} value={String(category.categoryId)}>
                    {`${"— ".repeat(category.depth)}${category.categoryName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "생성 중..." : "카테고리 생성"}
          </Button>
          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
