import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePublishPostMutation,
  useUpdatePostMutation,
} from "@/features/post/hooks/use-posts";
import { useEditorStore } from "@/stores/editor-store";
import { PostPayload } from "../post-api";
import {
  createPostImageUploadUuid,
  getPostImageUploadUuid,
} from "@/features/post/post-image-api";

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
  if (!payload.publishStatus) {
    setMessage("게시 상태를 선택해주세요.");
    return false;
  }
  return true;
};

export function usePostCreateActions() {
  const navigate = useNavigate();
  const {
    title,
    content,
    tagNames,
    categoryId,
    seriesId,
    postUuid,
    publishStatus,
    thumbnailImageUrl,
  } = useEditorStore();
  const [message, setMessage] = useState<string | null>(null);

  const publishMutation = usePublishPostMutation();

  const payload = useMemo(
    () => ({
      title: title.trim(),
      content,
      tagNames,
      categoryId,
      seriesId,
      postUuid,
      publishStatus,
      thumbnailImageUrl,
    }),
    [title, content, tagNames, categoryId, seriesId, postUuid, publishStatus, thumbnailImageUrl],
  );

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

  const handleGetUuid = async () => {
    try {
      const { data } = await createPostImageUploadUuid();
      if (data.postUuid) {
        return data.postUuid;
      } else {
        setMessage("UUID를 가져오는데 실패했습니다.");
        return null;
      }
    } catch {
      setMessage("UUID를 가져오는데 실패했습니다.");
      return null;
    }
  };

  return {
    message,
    isPublishPending: publishMutation.isPending,
    handlePublish,
    handleGetUuid,
  };
}

export function usePostUpdateActions({ postId }: UsePostUpdateActionsOptions) {
  const navigate = useNavigate();
  const {
    title,
    content,
    tagNames,
    categoryId,
    seriesId,
    postUuid,
    publishStatus,
    thumbnailImageUrl,
  } = useEditorStore();
  const [message, setMessage] = useState<string | null>(null);

  const updateMutation = useUpdatePostMutation();

  const payload = useMemo(
    () => ({
      title: title.trim(),
      content,
      tagNames,
      categoryId,
      seriesId,
      postUuid,
      publishStatus,
      thumbnailImageUrl,
    }),
    [title, content, tagNames, categoryId, seriesId, postUuid, publishStatus, thumbnailImageUrl],
  );

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

  const handleGetUuid = async () => {
    try {
      const { data } = await getPostImageUploadUuid(postId);
      if (data.postUuid) {
        return data.postUuid;
      } else {
        setMessage("UUID를 가져오는데 실패했습니다.");
        return null;
      }
    } catch {
      setMessage("UUID를 가져오는데 실패했습니다.");
      return null;
    }
  };

  return {
    message,
    isPublishPending: updateMutation.isPending,
    handlePublish,
    handleGetUuid,
  };
}
