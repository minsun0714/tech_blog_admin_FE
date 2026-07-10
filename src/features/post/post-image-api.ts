import { http } from "@/lib/http";

export const uploadPostImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return http.post<{ imageUrl: string }>(`/api/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePostImage = (postId: number, imageId: number) =>
  http.delete(`/api/posts/${postId}/images/${imageId}`);

export const deleteAllPostImages = (postId: number) =>
  http.delete(`/api/posts/${postId}/images`);
