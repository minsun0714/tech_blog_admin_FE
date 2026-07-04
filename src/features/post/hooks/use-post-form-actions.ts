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

interface UsePostFormActionsOptions {
  postId?: number;
}

export function usePostFormActions({ postId }: UsePostFormActionsOptions = {}) {
  const navigate = useNavigate();
  const { title, content, tagNames, categoryId, seriesId, setContent } = useEditorStore();
  const [currentPostId, setCurrentPostId] = useState<number | null>(postId ?? null);
  const [message, setMessage] = useState<string | null>(null);

  const draftMutation = useDraftPostMutation();
  const publishMutation = usePublishPostMutation();
  const updateMutation = useUpdatePostMutation();
  const uploadImageMutation = useUploadPostImageMutation();

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

  const validatePayload = () => {
    if (!payload.title) {
      setMessage("제목을 입력해주세요.");
      return false;
    }
    if (!payload.content.trim()) {
      setMessage("본문을 입력해주세요.");
      return false;
    }
    return true;
  };

  const ensureDraftPost = async () => {
    if (currentPostId) {
      return currentPostId;
    }

    const result = await draftMutation.mutateAsync(payload);

    if (result.postId) {
      setCurrentPostId(result.postId);
      setMessage("임시저장 후 이미지를 업로드했습니다.");
      return result.postId;
    }

    setMessage("임시저장 후 이미지를 추가할 수 있습니다.");
    return null;
  };

  const handleDraft = async () => {
    if (!validatePayload()) return;

    try {
      if (currentPostId) {
        await updateMutation.mutateAsync({ id: currentPostId, payload });
        setMessage("게시물을 임시저장 형태로 수정했습니다.");
      } else {
        const result = await draftMutation.mutateAsync(payload);
        setCurrentPostId(result.postId ?? null);
        setMessage(result.postId ? `임시저장했습니다. (ID ${result.postId})` : "임시저장했습니다.");
      }
    } catch {
      setMessage("임시저장에 실패했습니다.");
    }
  };

  const handlePublish = async () => {
    if (!validatePayload()) return;

    try {
      if (currentPostId) {
        await updateMutation.mutateAsync({ id: currentPostId, payload });
        setMessage("게시물을 수정했습니다.");
      } else {
        await publishMutation.mutateAsync(payload);
        setMessage("게시물을 발행했습니다.");
      }
      navigate("/posts");
    } catch {
      setMessage("게시물 저장에 실패했습니다.");
    }
  };

  const handleImageDrop = async (file: File, cursorPosition: number) => {
    try {
      const ensuredPostId = await ensureDraftPost();
      if (!ensuredPostId) return;

      const { imageUrl } = await uploadImageMutation.mutateAsync({ postId: ensuredPostId, file });
      const imageMarkdown = `![](${imageUrl})`;
      setContent(insertAtPosition(content, imageMarkdown, cursorPosition));
      setMessage("이미지를 업로드했습니다.");
    } catch {
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

  return {
    currentPostId,
    setCurrentPostId,
    message,
    handleDraft,
    handlePublish,
    handleImageDrop,
    isDraftPending: draftMutation.isPending || updateMutation.isPending,
    isPublishPending: publishMutation.isPending || updateMutation.isPending,
  };
}
