import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import MarkdownEditor from "@/features/post/components/MarkdownEditor";
import PostCategorySelect from "@/features/post/components/PostCategorySelect";
import PostFormActions from "@/features/post/components/PostFormActions";
import PostSeriesSelect from "@/features/post/components/PostSeriesSelect";
import PostTagInput from "@/features/post/components/PostTagInput";
import { usePostFormActions } from "@/features/post/hooks/use-post-form-actions";
import { useEditorStore } from "@/stores/editor-store";

interface PostFormProps {
  postId?: number;
}

export default function PostForm({ postId }: PostFormProps) {
  const navigate = useNavigate();
  const { title, content, tagNames, categoryId, seriesId, setTitle, setContent, setTagNames, setCategoryId, setSeriesId, reset } = useEditorStore();
  const { currentPostId, message, handleDraft, handlePublish, handleImageDrop, isDraftPending, isPublishPending } = usePostFormActions({ postId });

  useEffect(() => {
    reset();
  }, [postId, reset]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {postId ? "게시물 수정" : "게시물 작성"}
          </h2>
          <p className="text-sm text-slate-500">마크다운 에디터와 메타데이터를 함께 관리합니다.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/posts")}>
          목록으로
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{postId ? "게시물 수정 폼" : "새 게시물 폼"}</CardTitle>
          <CardDescription>이미지 드롭 시 임시저장 후 본문에 마크다운 이미지 링크를 삽입합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="post-title">제목</Label>
              <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="게시물 제목" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>본문</Label>
              <MarkdownEditor value={content} onChange={setContent} onImageDrop={handleImageDrop} />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>태그</Label>
              <PostTagInput value={tagNames} onChange={setTagNames} />
            </div>
            <PostCategorySelect value={categoryId} onChange={setCategoryId} />
            <PostSeriesSelect value={seriesId} onChange={setSeriesId} />
          </div>

          <Separator />

          <PostFormActions
            onDraft={() => void handleDraft()}
            onPublish={() => void handlePublish()}
            isDraftPending={isDraftPending}
            isPublishPending={isPublishPending}
            message={message}
            currentPostId={currentPostId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
