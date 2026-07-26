import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PostFormActions from "@/features/post/components/PostFormActions";
import PostSeriesSelect from "@/features/post/components/PostSeriesSelect";
import PostTagInput from "@/features/post/components/PostTagInput";
import { useEditorStore } from "@/stores/editor-store";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { PublishStatus } from "../hooks/use-posts";
import { CategorySelect } from "./CategorySelect";
import ThumbnailImageDropZone from "./ThumbnailImageDropZone";
import {
  Attachment,
  AttachmentMedia,
} from "@/components/ui/attachment";

interface PostFormProps {
  content: string;
  cardTitle: string;
  message: string | null;
  isPublishPending: boolean;
  handlePublish: () => void;
  handleGetUuid: () => Promise<string | null>;
}

export default function PostForm({
  content,
  cardTitle,
  message,
  isPublishPending,
  handlePublish,
  handleGetUuid,
}: PostFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const {
    title,
    tagNames,
    categoryId,
    seriesId,
    publishStatus,
    thumbnailImageUrl,
    setTitle,
    setTagNames,
    setCategoryId,
    setSeriesId,
    setPublishStatus,
  } = useEditorStore();

  return (
    <Card className="min-w-0 overflow-visible">
      <CardHeader className="flex flex-col items-start justify-between gap-4 space-y-0 pb-2 sm:flex-row sm:items-center">
        <div>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>
            {step === 1
              ? "제목과 본문을 작성해주세요."
              : "썸네일과 게시물 분류 정보를 설정해주세요."}
          </CardDescription>
        </div>
        <div className="flex items-center gap-3" aria-label="게시물 작성 단계">
          <span
            className={
              step === 1
                ? "text-sm font-semibold text-violet-700"
                : "text-sm text-slate-400"
            }
          >
            1. 내용 작성
          </span>
          <span className="text-slate-300" aria-hidden="true">
            /
          </span>
          <span
            className={
              step === 2
                ? "text-sm font-semibold text-violet-700"
                : "text-sm text-slate-400"
            }
          >
            2. 발행 정보
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className={step === 1 ? "min-w-0 space-y-6" : "hidden"}>
          <div className="space-y-2 max-w-full">
            <Label htmlFor="post-title">제목 *</Label>
            <Textarea
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목"
              className="w-full resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>본문 *</Label>
            <SimpleEditor content={content} handleGetUuid={handleGetUuid} />
          </div>
        </div>

        <div className={step === 2 ? "min-w-0 space-y-6" : "hidden"}>
          <div className="space-y-2">
            <Label>썸네일 이미지</Label>
            {thumbnailImageUrl && (
              <Attachment
                className="w-full"
                key="thumbnail"
                orientation="vertical"
              >
                <AttachmentMedia variant="image">
                  <img
                    src={thumbnailImageUrl}
                    alt="Thumbnail"
                    className="aspect-auto rounded-md object-cover"
                  />
                </AttachmentMedia>
              </Attachment>
            )}
            <ThumbnailImageDropZone />
          </div>

          <div className="space-y-2">
            <Label>태그</Label>
            <PostTagInput value={tagNames} onChange={setTagNames} />
          </div>

          <CategorySelect
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
          <PostSeriesSelect value={seriesId} onChange={setSeriesId} />

          <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
            <span className="text-sm font-medium text-slate-600">
              발행 상태
            </span>
            <Switch
              checked={publishStatus === PublishStatus.PUBLISHED}
              aria-label="게시글 발행 상태"
              onCheckedChange={(checked) =>
                setPublishStatus(
                  checked ? PublishStatus.PUBLISHED : PublishStatus.DRAFTED,
                )
              }
            />
            <span className="min-w-12 text-sm font-semibold text-slate-900">
              {publishStatus === PublishStatus.PUBLISHED ? "발행" : "임시저장"}
            </span>
          </div>
        </div>

        <div className="sticky bottom-3 z-30 -mx-2 rounded-xl border border-violet-100 bg-white/95 p-3 shadow-lg backdrop-blur sm:mx-0">
          {step === 1 ? (
            <div className="flex justify-end">
              <Button size="lg" onClick={() => setStep(2)} className="min-w-32">
                다음
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setStep(1)}
              >
                이전
              </Button>
              <div className="min-w-0 flex-1">
                <PostFormActions
                  cardTitle={cardTitle}
                  onPublish={() => handlePublish()}
                  isPublishPending={isPublishPending}
                  message={message}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
