import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CategoryDndProvider } from "@/features/category/components/CategoryDndProvider";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
} from "@/features/category/hooks/use-categories";
import { RootDropZone } from "@/features/category/components/CategoryTree";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { usePopover } from "../hooks/use-pop-over";
import { useState } from "react";
import { CategorySelectNode } from "./CategorySelectNode";

export function CategorySelect({
  categoryId,
  setCategoryId,
}: {
  categoryId: number | null;
  setCategoryId: (id: number) => void;
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const { open, setOpen, close } = usePopover();
  const { data, isLoading, isError } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  return (
    <div className="space-y-2">
      <Label>카테고리 *</Label>

      <CategoryDndProvider>
        <Card>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-400">
                카테고리를 불러오는 중입니다.
              </p>
            ) : null}
            {isError ? (
              <p className="text-sm text-rose-500">
                카테고리를 불러오지 못했습니다.
              </p>
            ) : null}
            {data?.length ? (
              <div className="space-y-3">
                {data.map((category) => (
                  <CategorySelectNode
                    key={category.categoryId}
                    category={category}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    createCategoryMutation={createCategoryMutation}
                    depth={0}
                  />
                ))}
                <RootDropZone />
              </div>
            ) : (
              <p className="text-sm text-slate-400">카테고리가 없습니다.</p>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={<Button variant="secondary" />}>
                루트 카테고리 추가
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <Label htmlFor="category-name">루트 카테고리 이름</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="예: 스프링 입문"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    createCategoryMutation
                      .mutateAsync({
                        name: newCategoryName,
                        parentId: null,
                      })
                      .finally(() => {
                        close();
                      })
                  }
                >
                  카테고리 추가
                </Button>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </CategoryDndProvider>
    </div>
  );
}
