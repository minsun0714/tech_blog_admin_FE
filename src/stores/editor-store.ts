import { create } from "zustand";

type EditorState = {
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number | null;
  seriesId: number | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTagNames: (tags: string[]) => void;
  setCategoryId: (id: number | null) => void;
  setSeriesId: (id: number | null) => void;
  reset: () => void;
};

const initialState = {
  title: "",
  content: "",
  tagNames: [],
  categoryId: null,
  seriesId: null,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTagNames: (tagNames) => set({ tagNames }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setSeriesId: (seriesId) => set({ seriesId }),
  reset: () => set(initialState),
}));
