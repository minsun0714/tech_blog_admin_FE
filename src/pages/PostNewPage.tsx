import { useEffect } from "react";
import PostForm from "@/features/post/components/PostForm";
import { usePostCreateActions } from "@/features/post/hooks/use-post-form-actions";
import { useEditorStore } from "@/stores/editor-store";

export default function PostNewPage() {
  const { content, reset } = useEditorStore();

  const {
    message,
    isDraftPending,
    isPublishPending,
    handleDraft,
    handlePublish,
  } = usePostCreateActions();

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <PostForm
      content={content}
      cardTitle="새 게시글 작성"
      message={message}
      isDraftPending={isDraftPending}
      isPublishPending={isPublishPending}
      handleDraft={handleDraft}
      handlePublish={handlePublish}
    />
  );
}
