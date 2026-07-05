import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import PostForm from "@/features/post/components/PostForm";
import { usePostQuery } from "@/features/post/hooks/use-posts";
import { useEditorStore } from "@/stores/editor-store";
import { usePostUpdateActions } from "@/features/post/hooks/use-post-form-actions";

export default function PostEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postId = Number(id);

  const {
    data: postData,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePostQuery(postId);

  const { setTitle, setContent, setTagNames, setCategoryId, setSeriesId } =
    useEditorStore();

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setContent(postData.content);
      setTagNames(postData.tags?.map((tag) => tag.name));
      setCategoryId(postData.categoryId);
      setSeriesId(postData.seriesId ?? null);
    }
  }, [postData]);

  const {
    message,
    handleImageDrop,
    isDraftPending,
    isPublishPending,
    handleDraft,
    handlePublish,
  } = usePostUpdateActions({ postId });

  if (isPostLoading) {
    return <div>Loading...</div>;
  }

  if (isPostError) {
    return <div>Error loading post data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            게시물 수정
          </h2>
          <p className="text-sm text-slate-500">
            마크다운 에디터와 메타데이터를 함께 관리합니다.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/posts")}>
          목록으로
        </Button>
      </div>
      <PostForm
        cardTitle={"게시물 수정"}
        message={message}
        onImageDrop={handleImageDrop}
        isDraftPending={isDraftPending}
        isPublishPending={isPublishPending}
        handleDraft={handleDraft}
        handlePublish={handlePublish}
      />
    </div>
  );
}
