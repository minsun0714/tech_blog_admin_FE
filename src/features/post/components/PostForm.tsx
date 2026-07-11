import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PostCategorySelect from "@/features/post/components/PostCategorySelect";
import PostFormActions from "@/features/post/components/PostFormActions";
import PostSeriesSelect from "@/features/post/components/PostSeriesSelect";
import PostTagInput from "@/features/post/components/PostTagInput";
import { useEditorStore } from "@/stores/editor-store";
import { Textarea } from "@/components/ui/textarea";

interface PostFormProps {
  content: string;
  cardTitle: string;
  message: string | null;
  isDraftPending: boolean;
  isPublishPending: boolean;
  handleDraft: () => void;
  handlePublish: () => void;
  handleGetUuid: () => Promise<string | null>;
}

export default function PostForm({
  content,
  cardTitle,
  message,
  isDraftPending,
  isPublishPending,
  handleDraft,
  handlePublish,
  handleGetUuid,
}: PostFormProps) {
  const {
    title,
    tagNames,
    categoryId,
    seriesId,
    setTitle,
    setTagNames,
    setCategoryId,
    setSeriesId,
  } = useEditorStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>
          이미지 드롭 시 임시저장 후 본문에 마크다운 이미지 링크를 삽입합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="space-y-2 max-w-full">
            <Label htmlFor="post-title">제목</Label>
            <Textarea
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목"
              className="w-full resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>본문</Label>
            <SimpleEditor content={content} handleGetUuid={handleGetUuid} />
          </div>
          <div className="space-y-2">
            <Label>태그</Label>
            <PostTagInput value={tagNames} onChange={setTagNames} />
          </div>
          <PostCategorySelect value={categoryId} onChange={setCategoryId} />
          <PostSeriesSelect value={seriesId} onChange={setSeriesId} />
        </div>

        <Separator />

        <PostFormActions
          cardTitle={cardTitle}
          onDraft={() => handleDraft()}
          onPublish={() => handlePublish()}
          isDraftPending={isDraftPending}
          isPublishPending={isPublishPending}
          message={message}
        />
      </CardContent>
    </Card>
  );
}
