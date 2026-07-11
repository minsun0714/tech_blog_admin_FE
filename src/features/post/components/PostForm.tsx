import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import MarkdownEditor from "@/features/post/components/MarkdownEditor";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PostCategorySelect from "@/features/post/components/PostCategorySelect";
import PostFormActions from "@/features/post/components/PostFormActions";
import PostSeriesSelect from "@/features/post/components/PostSeriesSelect";
import PostTagInput from "@/features/post/components/PostTagInput";
import { useEditorStore } from "@/stores/editor-store";
import TiptapEditor from "./TiptapEditor";

interface PostFormProps {
  cardTitle: string;
  message: string | null;
  onImageDrop: (file: File, cursorPosition: number) => void;
  isDraftPending: boolean;
  isPublishPending: boolean;
  handleDraft: () => void;
  handlePublish: () => void;
}

export default function PostForm({
  cardTitle,
  message,
  onImageDrop,
  isDraftPending,
  isPublishPending,
  handleDraft,
  handlePublish,
}: PostFormProps) {
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
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="post-title">제목</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목"
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>본문</Label>
            {/* <MarkdownEditor
              value={content}
              onChange={setContent}
              onImageDrop={onImageDrop}
            /> */}
            {/* <TiptapEditor /> */}
            <SimpleEditor />
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
