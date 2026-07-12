import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import {
  deletePost,
  getPost,
  getPostCount,
  getPostsByFilterCondition,
  publishPost,
  updatePost,
  type PostPayload,
} from "@/features/post/post-api";
import { FilterType } from "@/lib/type";

export function usePostCountQuery() {
  return useQuery({
    queryKey: ["posts", "count"],
    queryFn: getPostCount,
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

  const publishStatus = searchParams.get(
    "publishStatus",
  ) as PublishStatus | null;

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) - 1 : 0;

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
      toast.success("게시물이 저장되었습니다.");

      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
    onError: () => {
      toast.error("게시물 저장에 실패했습니다.");
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      toast.success("게시물이 수정되었습니다.");

      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
    onError: () => {
      toast.error("게시물 수정에 실패했습니다.");
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("게시물이 삭제되었습니다.");

      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
    onError: () => {
      toast.error("게시물 삭제에 실패했습니다.");
    },
  });
}
