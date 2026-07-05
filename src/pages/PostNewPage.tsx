import { useEffect } from "react";
import PostForm from "@/features/post/components/PostForm";
import { usePostCreateActions } from "@/features/post/hooks/use-post-form-actions";
import { useEditorStore } from "@/stores/editor-store";

export default function PostNewPage() {
  const {
    title,
    content,
    tagNames,
    categoryId,
    seriesId,
    setTitle,
    setContent,
    setTagNames,
    setCategoryId,
    setSeriesId,
    reset,
  } = useEditorStore();

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
      title={title}
      content={content}
      tagNames={tagNames}
      categoryId={categoryId}
      seriesId={seriesId}
      setTitle={setTitle}
      setContent={setContent}
      setTagNames={setTagNames}
      setCategoryId={setCategoryId}
      setSeriesId={setSeriesId}
      message={message}
      onImageDrop={handleImageDrop}
      isDraftPending={isDraftPending}
      isPublishPending={isPublishPending}
      handleDraft={handleDraft}
      handlePublish={handlePublish}
    />
  );
}
