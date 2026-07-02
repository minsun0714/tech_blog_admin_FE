import { http } from "@/lib/http";

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children: Category[];
}

interface CategoryMutationPayload {
  name: string;
  parentId: number | null;
}

function toNumberOrNull(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return Number.parseInt(value.trim(), 10);
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCategory(raw: unknown): Category | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = toNumberOrNull(raw.id);
  const name = typeof raw.name === "string" ? raw.name : null;

  if (id === null || !name) {
    return null;
  }

  const nestedChildren = Array.isArray(raw.children) ? raw.children : [];

  return {
    id,
    name,
    parentId: toNumberOrNull(raw.parentId),
    children: nestedChildren.map(normalizeCategory).filter((category): category is Category => category !== null),
  };
}

function buildCategoryTree(categories: Category[]) {
  const categoryMap = new Map<number, Category>(
    categories.map((category) => [
      category.id,
      {
        ...category,
        children: [],
      },
    ])
  );

  for (const category of categoryMap.values()) {
    if (category.parentId === null) {
      continue;
    }

    const parent = categoryMap.get(category.parentId);

    if (parent) {
      parent.children.push(category);
    }
  }

  return [...categoryMap.values()].filter(
    (category) => category.parentId === null || !categoryMap.has(category.parentId)
  );
}

function normalizeCategories(payload: unknown) {
  const categoryList = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.categories)
      ? payload.categories
      : isRecord(payload) && Array.isArray(payload.data)
        ? payload.data
        : [];

  const normalizedCategories = categoryList
    .map(normalizeCategory)
    .filter((category): category is Category => category !== null);

  if (normalizedCategories.some((category) => category.children.length > 0)) {
    return normalizedCategories;
  }

  return buildCategoryTree(normalizedCategories);
}

export async function fetchCategories() {
  const response = await http.get("/api/categories");
  return normalizeCategories(response.data);
}

export async function createCategory(payload: CategoryMutationPayload) {
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
