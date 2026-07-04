import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flattenCategories } from "@/features/category/category-api";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";

const NONE_VALUE = "__none__";

interface PostCategorySelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function PostCategorySelect({ value, onChange }: PostCategorySelectProps) {
  const { data: categories } = useCategoriesQuery();
  const categoryOptions = useMemo(() => flattenCategories(categories ?? []), [categories]);

  return (
    <div className="space-y-2">
      <Label>카테고리</Label>
      <Select
        value={value === null ? NONE_VALUE : String(value)}
        onValueChange={(v) => onChange(v === NONE_VALUE ? null : Number.parseInt(v, 10))}
      >
        <SelectTrigger>
          <SelectValue placeholder="카테고리 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>선택 안 함</SelectItem>
          {categoryOptions.map((category) => (
            <SelectItem key={category.categoryId} value={String(category.categoryId)}>
              {`${"— ".repeat(category.depth)}${category.categoryName}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
