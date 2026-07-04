import { create } from "zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag, deleteTag, updateTag } from "@/features/tag/tag-api";

export type TagItem = {
  id: number;
  name: string;
};

type TagStore = {
  tags: TagItem[];
  addTag: (tag: TagItem) => void;
  updateTagName: (id: number, name: string) => void;
  removeTag: (id: number) => void;
};

const createLocalTagId = () => -Date.now() - Math.floor(Math.random() * 1000);

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.some((item) => item.id === tag.id || item.name === tag.name)
        ? state.tags
        : [...state.tags, tag],
    })),
  updateTagName: (id, name) =>
    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === id ? { ...tag, name } : tag)),
    })),
  removeTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    })),
}));

function extractTagId(headers: unknown, fallbackName: string) {
  const rawHeaders = headers as
    | { location?: string; Location?: string; get?: (name: string) => string | null | undefined }
    | undefined;
  const location = rawHeaders?.location ?? rawHeaders?.Location ?? rawHeaders?.get?.("location");
  const matchedId = location?.match(/\/(\d+)$/)?.[1];

  if (matchedId) {
    return Number.parseInt(matchedId, 10);
  }

  return createLocalTagId() - fallbackName.length;
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  const addTag = useTagStore((state) => state.addTag);

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await createTag(name);
      return {
        id: extractTagId(response.headers, name),
        name,
      };
    },
    onSuccess: (tag) => {
      addTag(tag);
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();
  const updateTagName = useTagStore((state) => state.updateTagName);

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (id > 0) {
        await updateTag(id, name);
      }
      return { id, name };
    },
    onSuccess: ({ id, name }) => {
      updateTagName(id, name);
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  const removeTag = useTagStore((state) => state.removeTag);

  return useMutation({
    mutationFn: async (id: number) => {
      if (id > 0) {
        await deleteTag(id);
      }
      return id;
    },
    onSuccess: (id) => {
      removeTag(id);
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
