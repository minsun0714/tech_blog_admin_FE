import { PublishStatus } from "@/features/post/hooks/use-posts";
import { create } from "zustand";

type EditorState = {
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number | null;
  seriesId: number | null;
  postUuid: string | null;
  publishStatus: PublishStatus;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTagNames: (tags: string[]) => void;
  setCategoryId: (id: number | null) => void;
  setSeriesId: (id: number | null) => void;
  setPostUuid: (uuid: string | null) => void;
  setPublishStatus: (status: PublishStatus) => void;
  reset: () => void;
};

const initialState = {
  title: "",
  content: "",
  tagNames: [],
  categoryId: null,
  seriesId: null,
  postUuid: null,
  publishStatus: PublishStatus.PUBLISHED,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTagNames: (tagNames) => set({ tagNames }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setSeriesId: (seriesId) => set({ seriesId }),
  setPostUuid: (postUuid) => set({ postUuid }),
  setPublishStatus: (publishStatus: PublishStatus) => set({ publishStatus }),
  reset: () => set(initialState),
}));
