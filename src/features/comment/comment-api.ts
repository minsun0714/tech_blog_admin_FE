import { http } from "@/lib/http";

export type CommentNode = {
  commentId: number;
  commentParentId: number | null;
  content: string;
  childrenCommentList: CommentNode[];
};

export const getComments = (postId: number) =>
  http
    .get<{ commentResponseList: CommentNode[] }>(`/api/posts/${postId}/comments`)
    .then((r) => r.data.commentResponseList);

export const createRootComment = (postId: number, content: string) => http.post(`/api/posts/${postId}/comments`, { content });

export const createReplyComment = (commentId: number, postId: number, content: string) =>
  http.post(`/api/comments/${commentId}/replies`, { postId, content });

export const deleteComment = (id: number) => http.delete(`/api/comments/${id}`);
export const updateComment = (id: number, content: string) => http.patch(`/api/comments/${id}`, { content });
