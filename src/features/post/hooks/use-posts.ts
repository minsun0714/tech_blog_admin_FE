import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPost,
  deletePost,
  draftPost,
  getPostsByFilterCondition,
  publishPost,
  type PostPayload,
  updatePost,
} from "@/features/post/post-api";
import { FilterType } from "@/lib/type";

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

export function usePostQuery(postId: number) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
  });
}

export function usePostsQuery(
  filterType: FilterType,
  filterValue: number | null = null,
) {
  return useQuery({
    queryKey: ["posts", filterType, filterValue],
    queryFn: () => getPostsByFilterCondition(filterType, filterValue),
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
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function usePublishPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
