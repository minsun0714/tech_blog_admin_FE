import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPost,
  getPostCount,
  deletePost,
  getPostsByFilterCondition,
  publishPost,
  type PostPayload,
  updatePost,
} from "@/features/post/post-api";
import { FilterType } from "@/lib/type";
import { useSearchParams } from "react-router-dom";

export function usePostCountQuery() {
  return useQuery({
    queryKey: ["posts", "count"],
    queryFn: () => getPostCount(),
  });
}

export function usePostQuery(postId: number) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
  });
}

export enum PublishStatus {
  PUBLISHED = "PUBLISHED",
  DRAFTED = "DRAFTED",
}

export function usePostsQuery(
  filterType: FilterType,
  filterValue: number | null = null,
) {
  const [searchParams] = useSearchParams();

  const publishStatus: PublishStatus | null = searchParams.get(
    "publishStatus",
  ) as PublishStatus | null;

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) - 1 : 0;

  return useQuery({
    queryKey: ["posts", filterType, filterValue, publishStatus, page],
    queryFn: () =>
      getPostsByFilterCondition(filterType, filterValue, publishStatus, page),
  });
}

export function usePublishPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
  });
}
