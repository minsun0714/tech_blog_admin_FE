import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReplyComment,
  createRootComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/features/comment/comment-api";

export function useCommentsQuery(postId: number) {
  return useQuery({ queryKey: ["comments", postId], queryFn: () => getComments(postId) });
}

export function useCreateRootCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createRootComment(postId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useCreateReplyCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      createReplyComment(commentId, postId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useDeleteCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useUpdateCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => updateComment(id, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}
