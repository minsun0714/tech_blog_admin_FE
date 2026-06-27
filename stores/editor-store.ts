import { create } from "zustand";

type EditorState = {
  title: string;
  content: string;
  uploadedImages: UploadedImage[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setUploadedImages: (images: UploadedImage[]) => void;
};

export type UploadedImage = {
  id: string;
  fileName: string;
  url: string;
  size: number;
  uploadedAt: string;
};

export const useEditorStore = create<EditorState>((set) => ({
  title: "",
  content: "",
  uploadedImages: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setUploadedImages: (uploadedImages) => set({ uploadedImages }),
}));
