import { http } from "@/lib/http";

export type CategoryNode = {
  categoryId: number;
  parentId: number | null;
  categoryName: string;
  childrenCategoryList: CategoryNode[];
};

export type FlatCategory = {
  categoryId: number;
  parentId: number | null;
  categoryName: string;
  depth: number;
};

export const getCategories = () =>
  http.get<{ categoryList: CategoryNode[] }>("/api/categories").then((r) => r.data.categoryList);
export const createCategory = (name: string, parentId: number | null) =>
  http.post("/api/categories", { name, parentId });
export const deleteCategory = (id: number) => http.delete(`/api/categories/${id}`);
export const updateCategoryName = (id: number, name: string) =>
  http.patch(`/api/categories/${id}/name`, { name });
export const changeCategoryParent = (id: number, parentId: number | null) =>
  http.patch(`/api/categories/${id}/parent`, { parentId });

export function flattenCategories(categories: CategoryNode[], depth = 0): FlatCategory[] {
  return categories.flatMap((category) => [
    {
      categoryId: category.categoryId,
      parentId: category.parentId,
      categoryName: category.categoryName,
      depth,
    },
    ...flattenCategories(category.childrenCategoryList, depth + 1),
  ]);
}
