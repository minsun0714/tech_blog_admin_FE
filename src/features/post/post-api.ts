import { http } from "@/lib/http";
import { FilterType } from "@/lib/type";
import { PublishStatus } from "./hooks/use-posts";

export type Paged<T> = {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
};

export type Post = {
  postId: number;
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number;
  seriesId?: number | null;
  publishStatus: PublishStatus;
};

export type PostWithUuid = Post & {
  postUuid: string;
  thumbnailImageUrl?: string | null;
};

export type PostPayload = {
  title: string;
  content: string;
  tagNames: string[];
  categoryId: number | null;
  seriesId: number | null;
  publishStatus: PublishStatus;
};

export const getPostCount = () =>
  http
    .get<{
      publishedPostCount: number;
      draftedPostCount: number;
    }>("/api/posts/count")
    .then((r) => r.data);

export const getPost = (postId: number) =>
  http.get<PostWithUuid>(`/api/posts/${postId}`).then((r) => r.data);

export const getPostsByFilterCondition = (
  filterType: FilterType,
  filterValue: number | null = null,
  publishStatus: "PUBLISHED" | "DRAFTED" | null = null,
  page: number = 0,
) =>
  http
    .get<Paged<Post>>("/api/posts", {
      params: { [filterType + "Id"]: filterValue, publishStatus, page },
    })
    .then((r) => r.data);

export const publishPost = (payload: PostPayload) =>
  http.post("/api/posts", payload);

export const updatePost = (id: number, payload: PostPayload) =>
  http.put(`/api/posts/${id}`, payload);

export const deletePost = (id: number) => http.delete(`/api/posts/${id}`);
