import { http } from "@/lib/http";
import { FilterType } from "@/lib/type";

export type Post = {
  postId: number;
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number;
  seriesId?: number | null;
};

export type PostWithUuid = Post & {
  postUuid: string;
};

export type PostPayload = {
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number | null;
  seriesId: number | null;
};

export const getPost = (postId: number) =>
  http.get<PostWithUuid>(`/api/posts/${postId}`).then((r) => r.data);

export const getPostsByFilterCondition = (
  filterType: FilterType,
  filterValue: number | null = null,
) =>
  http
    .get<{ content: Post[] }>("/api/posts", {
      params: { [filterType + "Id"]: filterValue },
    })
    .then((r) => r.data.content);

export const draftPost = (payload: PostPayload) =>
  http.post("/api/posts/draft", payload);

export const publishPost = (payload: PostPayload) =>
  http.post("/api/posts/publish", payload);

export const updatePost = (id: number, payload: PostPayload) =>
  http.patch(`/api/posts/${id}`, payload);

export const deletePost = (id: number) => http.delete(`/api/posts/${id}`);
