import { http } from "@/lib/http";

interface CategoryCreatePayload {
  name: string;
  parentId: number | null;
}

export async function createCategory(payload: CategoryCreatePayload) {
  await http.post("/api/categories", payload);
}

export async function updateCategoryName(id: number, name: string) {
  await http.patch(`/api/categories/${id}/name`, { name });
}

export async function changeCategoryParent(id: number, parentId: number | null) {
  await http.patch(`/api/categories/${id}/parent`, { parentId });
}

export async function deleteCategory(id: number) {
  await http.delete(`/api/categories/${id}`);
}
