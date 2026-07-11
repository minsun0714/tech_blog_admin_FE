import { http } from "@/lib/http";

export const createPostImageUploadUuid = () =>
  http.get<{ postUuid: string }>(`/api/images/uuid`);

export const getPostImageUploadUuid = (postId: number) =>
  http.get<{ postUuid: string }>(`/api/images/uuid/${postId}`);

export const uploadPostImage = (file: File, postUuid: string) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("postUuid", postUuid);
  return http.post<{ imageUrl: string }>(`/api/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePostImage = (postId: number, imageId: number) =>
  http.delete(`/api/posts/${postId}/images/${imageId}`);

export const deleteAllPostImages = (postId: number) =>
  http.delete(`/api/posts/${postId}/images`);
