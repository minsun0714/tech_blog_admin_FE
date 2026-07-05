import { useEffect } from "react";
import PostForm from "@/features/post/components/PostForm";
import { usePostCreateActions } from "@/features/post/hooks/use-post-form-actions";
import { useEditorStore } from "@/stores/editor-store";

export default function PostNewPage() {
  const { reset } = useEditorStore();

  const {
    message,
    handleImageDrop,
    isDraftPending,
    isPublishPending,
    handleDraft,
    handlePublish,
  } = usePostCreateActions();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <PostForm
      cardTitle="게시물 작성"
      message={message}
      onImageDrop={handleImageDrop}
      isDraftPending={isDraftPending}
      isPublishPending={isPublishPending}
      handleDraft={handleDraft}
      handlePublish={handlePublish}
    />
  );
}
