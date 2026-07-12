import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeCategoryParent,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategoryName,
} from "@/features/category/category-api";
import { toast } from "sonner";

export function useCategoriesQuery({ enabled }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      parentId,
    }: {
      name: string;
      parentId: number | null;
    }) => createCategory(name, parentId),
    onSuccess: () => {
      toast.success("카테고리가 생성되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("카테고리 생성에 실패했습니다.");
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("카테고리가 삭제되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("카테고리 삭제에 실패했습니다.");
    },
  });
}

export function useUpdateCategoryNameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategoryName(id, name),
    onSuccess: () => {
      toast.success("카테고리 이름이 변경되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("카테고리 이름 변경에 실패했습니다.");
    },
  });
}

export function useChangeCategoryParentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId }: { id: number; parentId: number | null }) =>
      changeCategoryParent(id, parentId),
    onSuccess: () => {
      toast.success("카테고리 위치가 변경되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("카테고리 위치 변경에 실패했습니다.");
    },
  });
}
