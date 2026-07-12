import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPost,
  getPostCount,
  deletePost,
  draftPost,
  getPostsByFilterCondition,
  publishPost,
  type PostPayload,
  updatePost,
} from "@/features/post/post-api";
import { FilterType } from "@/lib/type";
import { useSearchParams } from "react-router-dom";

function extractLocationHeader(headers: unknown) {
  const rawHeaders = headers as
    | {
        location?: string;
        Location?: string;
        get?: (name: string) => string | null | undefined;
      }
    | undefined;
  return (
    rawHeaders?.location ??
    rawHeaders?.Location ??
    rawHeaders?.get?.("location") ??
    null
  );
}

function parsePostIdFromLocation(location: string | null) {
  const matchedId = location?.match(/\/(\d+)$/)?.[1];
  return matchedId ? Number.parseInt(matchedId, 10) : null;
}

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

  return useQuery({
    queryKey: ["posts", filterType, filterValue, publishStatus],
    queryFn: () =>
      getPostsByFilterCondition(filterType, filterValue, publishStatus),
  });
}

export function useDraftPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PostPayload) => {
      const response = await draftPost(payload);
      const location = extractLocationHeader(response.headers);
      const postId = parsePostIdFromLocation(location);
      return { response, postId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "count"] });
    },
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
