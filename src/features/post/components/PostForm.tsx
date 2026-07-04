import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { flattenCategories } from "@/features/category/category-api";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";
import MarkdownEditor from "@/features/post/components/MarkdownEditor";
import PostTagInput from "@/features/post/components/PostTagInput";
import { useUploadPostImageMutation } from "@/features/post/hooks/use-post-image";
import {
  useDraftPostMutation,
  usePublishPostMutation,
  useUpdatePostMutation,
} from "@/features/post/hooks/use-posts";
import { useSeriesQuery } from "@/features/series/hooks/use-series";
import { useEditorStore } from "@/stores/editor-store";

interface PostFormProps {
  postId?: number;
}

const NONE_VALUE = "__none__";

function insertAtPosition(content: string, insertText: string, position: number) {
  return `${content.slice(0, position)}${insertText}${content.slice(position)}`;
}

export default function PostForm({ postId }: PostFormProps) {
  const navigate = useNavigate();
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
  const [currentPostId, setCurrentPostId] = useState<number | null>(postId ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const { data: categories } = useCategoriesQuery();
  const { data: series } = useSeriesQuery();
  const categoryOptions = useMemo(() => flattenCategories(categories ?? []), [categories]);
  const draftMutation = useDraftPostMutation();
  const publishMutation = usePublishPostMutation();
  const updateMutation = useUpdatePostMutation();
  const uploadImageMutation = useUploadPostImageMutation();

  useEffect(() => {
    reset();
    setCurrentPostId(postId ?? null);
  }, [postId, reset]);

  const payload = {
    title: title.trim(),
    content,
    tagNames,
    categoryId,
    seriesId,
  };

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
    if (!validatePayload()) {
      return;
    }

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
    if (!validatePayload()) {
      return;
    }

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

      if (!ensuredPostId) {
        return;
      }

      const { imageUrl } = await uploadImageMutation.mutateAsync({ postId: ensuredPostId, file });
      const imageMarkdown = `![](${imageUrl})`;
      setContent(insertAtPosition(content, imageMarkdown, cursorPosition));
      setMessage("이미지를 업로드했습니다.");
    } catch {
      setMessage("이미지 업로드에 실패했습니다.");
    }
  };

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
              <Input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="게시물 제목" />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label>본문</Label>
              <MarkdownEditor value={content} onChange={setContent} onImageDrop={handleImageDrop} />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label>태그</Label>
              <PostTagInput value={tagNames} onChange={setTagNames} />
            </div>

            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select value={categoryId === null ? NONE_VALUE : String(categoryId)} onValueChange={(value) => setCategoryId(value === NONE_VALUE ? null : Number.parseInt(value, 10))}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>선택 안 함</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.categoryId} value={String(category.categoryId)}>
                      {`${"— ".repeat(category.depth)}${category.categoryName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>시리즈</Label>
              <Select value={seriesId === null ? NONE_VALUE : String(seriesId)} onValueChange={(value) => setSeriesId(value === NONE_VALUE ? null : Number.parseInt(value, 10))}>
                <SelectTrigger>
                  <SelectValue placeholder="시리즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>선택 안 함</SelectItem>
                  {(series ?? []).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void handleDraft()} disabled={draftMutation.isPending || updateMutation.isPending}>
              {draftMutation.isPending || updateMutation.isPending ? "저장 중..." : "임시저장"}
            </Button>
            <Button
              variant="outline"
              onClick={() => void handlePublish()}
              disabled={publishMutation.isPending || updateMutation.isPending}
            >
              {publishMutation.isPending || updateMutation.isPending ? "처리 중..." : "발행"}
            </Button>
          </div>

          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
          {currentPostId ? <p className="text-xs text-slate-400">현재 임시 게시물 ID: {currentPostId}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
