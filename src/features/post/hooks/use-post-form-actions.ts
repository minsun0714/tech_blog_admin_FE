import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUploadPostImageMutation } from "@/features/post/hooks/use-post-image";
import {
  useDraftPostMutation,
  usePublishPostMutation,
  useUpdatePostMutation,
} from "@/features/post/hooks/use-posts";
import { insertAtPosition } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { PostPayload } from "../post-api";

interface UsePostUpdateActionsOptions {
  postId: number;
}

const validatePayload = (
  payload: PostPayload,
  setMessage: (message: string) => void,
) => {
  if (!payload.title) {
    setMessage("제목을 입력해주세요.");
    return false;
  }
  if (!payload.content.trim()) {
    setMessage("본문을 입력해주세요.");
    return false;
  }
  if (!payload.categoryId) {
    setMessage("카테고리를 선택해주세요.");
    return false;
  }
  return true;
};

export function usePostCreateActions() {
  const navigate = useNavigate();
  const { title, content, tagNames, categoryId, seriesId } = useEditorStore();
  const [message, setMessage] = useState<string | null>(null);

  const draftMutation = useDraftPostMutation();
  const publishMutation = usePublishPostMutation();

  const payload = useMemo(
    () => ({
      title: title.trim(),
      content,
      tagNames,
      categoryId,
      seriesId,
    }),
    [title, content, tagNames, categoryId, seriesId],
  );

  const handleDraft = async () => {
    if (!validatePayload(payload, setMessage)) return;

    try {
      const result = await draftMutation.mutateAsync(payload);
      setMessage(
        result.postId
          ? `임시저장했습니다. (ID ${result.postId})`
          : "임시저장했습니다.",
      );
    } catch {
      setMessage("임시저장에 실패했습니다.");
    }
  };

  const handlePublish = async () => {
    if (!validatePayload(payload, setMessage)) return;

    try {
      await publishMutation.mutateAsync(payload);
      setMessage("게시물을 발행했습니다.");

      navigate("/posts");
    } catch {
      setMessage("게시물 저장에 실패했습니다.");
    }
  };

  return {
    message,
    isDraftPending: draftMutation.isPending,
    isPublishPending: publishMutation.isPending,
    handleDraft,
    handlePublish,
  };
}

export function usePostUpdateActions({ postId }: UsePostUpdateActionsOptions) {
  const navigate = useNavigate();
  const { title, content, tagNames, categoryId, seriesId } = useEditorStore();
  const [message, setMessage] = useState<string | null>(null);

  const updateMutation = useUpdatePostMutation();
  const draftMutation = useDraftPostMutation();

  const payload = useMemo(
    () => ({
      title: title.trim(),
      content,
      tagNames,
      categoryId,
      seriesId,
    }),
    [title, content, tagNames, categoryId, seriesId],
  );

  const handleDraft = async () => {
    if (!validatePayload(payload, setMessage)) return;

    try {
      await draftMutation.mutateAsync(payload);
      setMessage("게시물을 임시저장 형태로 수정했습니다.");
    } catch {
      setMessage("임시저장에 실패했습니다.");
    }
  };

  const handlePublish = async () => {
    if (!validatePayload(payload, setMessage)) return;

    try {
      await updateMutation.mutateAsync({ id: postId, payload });
      setMessage("게시물을 발행했습니다.");

      navigate("/posts");
    } catch {
      setMessage("게시물 저장에 실패했습니다.");
    }
  };

  return {
    message,
    isDraftPending: draftMutation.isPending,
    isPublishPending: updateMutation.isPending,
    handleDraft,
    handlePublish,
  };
}
