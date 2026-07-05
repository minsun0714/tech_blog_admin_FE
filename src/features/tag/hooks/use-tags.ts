import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTags,
  createTag,
  deleteTag,
  updateTag,
} from "@/features/tag/tag-api";

export function useFetchTags() {
  return useQuery({
    queryFn: fetchTags,
    queryKey: ["tags"],
  });
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => createTag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (id > 0) {
        await updateTag(id, name);
      }
      return { id, name };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (id > 0) {
        await deleteTag(id);
      }
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
