import { http } from "@/lib/http";

export type Post = { postId: number; title: string; [key: string]: unknown };

export type PostPayload = {
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number | null;
  seriesId: number | null;
};

export const getPostsByCategory = (categoryId: number) =>
  http.get<{ postResponseList: Post[] }>(`/api/posts?categoryId=${categoryId}`).then((r) => r.data.postResponseList);

export const getPostsBySeries = (seriesId: number) =>
  http.get<{ postResponseList: Post[] }>(`/api/posts?seriesId=${seriesId}`).then((r) => r.data.postResponseList);

export const draftPost = (payload: PostPayload) => http.post("/api/posts/draft", payload);

export const publishPost = (payload: PostPayload) => http.post("/api/posts/publish", payload);

export const updatePost = (id: number, payload: PostPayload) => http.patch(`/api/posts/${id}`, payload);

export const deletePost = (id: number) => http.delete(`/api/posts/${id}`);
