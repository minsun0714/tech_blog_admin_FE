import { http } from "@/lib/http";

export const uploadPostImage = (postId: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return http.post<{ imageUrl: string }>(`/api/posts/${postId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePostImage = (postId: number, imageId: number) =>
  http.delete(`/api/posts/${postId}/images/${imageId}`);

export const deleteAllPostImages = (postId: number) => http.delete(`/api/posts/${postId}/images`);
