import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PostFormActions from "@/features/post/components/PostFormActions";
import PostSeriesSelect from "@/features/post/components/PostSeriesSelect";
import PostTagInput from "@/features/post/components/PostTagInput";
import { useEditorStore } from "@/stores/editor-store";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PublishStatus } from "../hooks/use-posts";
import {
  CategoryDndProvider,
  useCategoryDnd,
} from "@/features/category/components/CategoryDndProvider";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryNameMutation,
} from "@/features/category/hooks/use-categories";
import { RootDropZone } from "@/features/category/components/CategoryTree";
import type { CategoryNode as CategoryNodeType } from "@/features/category/category-api";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { usePopover } from "../hooks/use-pop-over";

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
  const [newCategoryName, setNewCategoryName] = useState("");
  const {
    title,
    tagNames,
    categoryId,
    seriesId,
    publishStatus,
    setTitle,
    setTagNames,
    setCategoryId,
    setSeriesId,
    setPublishStatus,
  } = useEditorStore();
  const { open, setOpen, close } = usePopover();
  const { data, isLoading, isError } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>
            이미지 드롭 시 임시저장 후 본문에 마크다운 이미지 링크를 삽입합니다.
          </CardDescription>
        </div>
        <div>
          <span className="ml-2 text-sm text-black">임시저장</span>
          <Switch
            checked={publishStatus === PublishStatus.PUBLISHED}
            onCheckedChange={(checked) =>
              setPublishStatus(
                checked ? PublishStatus.PUBLISHED : PublishStatus.DRAFTED,
              )
            }
          />
          <span className="ml-2 text-sm text-black">저장</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
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
          <div className="space-y-2">
            <Label>태그</Label>
            <PostTagInput value={tagNames} onChange={setTagNames} />
          </div>
          <div className="space-y-2">
            <Label>카테고리 *</Label>

            <CategoryDndProvider>
              <Card>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-slate-400">
                      카테고리를 불러오는 중입니다.
                    </p>
                  ) : null}
                  {isError ? (
                    <p className="text-sm text-rose-500">
                      카테고리를 불러오지 못했습니다.
                    </p>
                  ) : null}
                  {data?.length ? (
                    <div className="space-y-3">
                      {data.map((category) => (
                        <CategorySelectNode
                          key={category.categoryId}
                          category={category}
                          categoryId={categoryId}
                          setCategoryId={setCategoryId}
                          createCategoryMutation={createCategoryMutation}
                          depth={0}
                        />
                      ))}
                      <RootDropZone />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      카테고리가 없습니다.
                    </p>
                  )}

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger render={<Button variant="secondary" />}>
                      루트 카테고리 추가
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <Label htmlFor="category-name">
                          루트 카테고리 이름
                        </Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(event) =>
                            setNewCategoryName(event.target.value)
                          }
                          placeholder="예: 스프링 입문"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          createCategoryMutation.mutateAsync({
                            name: newCategoryName,
                            parentId: null,
                          }).finally(() => {
                            close();
                          })
                        }
                      >
                        카테고리 추가
                      </Button>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </CategoryDndProvider>
          </div>
          <PostSeriesSelect value={seriesId} onChange={setSeriesId} />
        </div>

        <Separator />

        <PostFormActions
          cardTitle={cardTitle}
          onPublish={() => handlePublish()}
          isPublishPending={isPublishPending}
          message={message}
        />
      </CardContent>
    </Card>
  );
}

function CategorySelectNode({
  category,
  categoryId,
  setCategoryId,
  depth = 0,
  createCategoryMutation,
}: {
  category: CategoryNodeType;
  categoryId: number | null;
  setCategoryId: (id: number) => void;
  depth: number;
  createCategoryMutation: ReturnType<typeof useCreateCategoryMutation>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.categoryName);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { open, setOpen, close } = usePopover();

  const updateMutation = useUpdateCategoryNameMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const {
    draggedId,
    dropTargetId,
    setDropTargetId,
    onDragStart,
    onDragEnd,
    onDrop,
  } = useCategoryDnd();

  const isDragging = draggedId === category.categoryId;
  const isDropTarget = dropTargetId === category.categoryId;

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await updateMutation.mutateAsync({
      id: category.categoryId,
      name: trimmedName,
    });
    setIsEditing(false);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setCategoryId(category.categoryId);
      }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(category.categoryId);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(category.categoryId);
      }}
      onDragLeave={(e) => {
        if (
          e.relatedTarget &&
          !e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          setDropTargetId(null);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(category.categoryId);
      }}
      className={cn(
        "space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 transition-all ",
        isDragging && "opacity-40",
        isDropTarget &&
          !isDragging &&
          "border-violet-400 bg-violet-100 ring-2 ring-violet-300",

        category.categoryId === categoryId && "bg-violet-500",
      )}
    >
      {categoryId && category.categoryId === categoryId && (
        <p>카테고리를 {category?.categoryName}로 선택했습니다.</p>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {isEditing ? (
          <form className="flex flex-1 gap-2" onSubmit={handleUpdate}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button size="sm" type="submit" disabled={updateMutation.isPending}>
              저장
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {category.categoryName}
                </p>
              </div>
              <p className="text-xs text-slate-500">ID {category.categoryId}</p>
            </div>
          </div>
        )}

        <div className="flex gap-10">
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={<Button variant="secondary" />}>
                자식 카테고리 추가
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <Label htmlFor="category-name">자식 카테고리 이름</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="예: 스프링 입문"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    createCategoryMutation
                      .mutateAsync({
                        name: newCategoryName,
                        parentId: category.categoryId,
                      })
                      .finally(() => {
                        close();
                      })
                  }
                >
                  카테고리 추가
                </Button>
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() =>
                void deleteMutation.mutateAsync(category.categoryId)
              }
            >
              삭제
            </Button>
          </div>
        </div>
      </div>

      {category.childrenCategoryList.length > 0 ? (
        <div className="space-y-3">
          {category.childrenCategoryList.map((child) => (
            <CategorySelectNode
              key={child.categoryId}
              category={child}
              setCategoryId={setCategoryId}
              categoryId={categoryId}
              createCategoryMutation={createCategoryMutation}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
