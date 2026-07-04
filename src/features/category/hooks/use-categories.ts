import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeCategoryParent,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategoryName,
} from "@/features/category/category-api";

export function useCategoriesQuery() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: number | null }) => createCategory(name, parentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategoryNameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateCategoryName(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useChangeCategoryParentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId }: { id: number; parentId: number }) => changeCategoryParent(id, parentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
