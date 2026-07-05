import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TagChip from "@/features/tag/components/TagChip";
import TagCreateChip from "@/features/tag/components/TagCreateChip";
import {
  useFetchTags,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "@/features/tag/hooks/use-tags";
import { Button } from "@/components/ui/Button";

export type TagItem = {
  id: number;
  name: string;
};

export default function TagList() {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const { data: tags } = useFetchTags({ enabled: true });
  const updateMutation = useUpdateTagMutation();
  const deleteMutation = useDeleteTagMutation();

  const handleUpdate = async (id: number, name: string) => {
    await updateMutation.mutateAsync({ id, name });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <div>
          <CardTitle>태그 목록</CardTitle>
          <CardDescription>
            클릭하여 이름을 수정하거나 제거할 수 있습니다.
          </CardDescription>
        </div>
        <Button size="lg" onClick={() => setIsEditingMode((prev) => !prev)}>
          {isEditingMode ? "취소" : "수정 모드"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag: TagItem) => (
            <TagChip
              isEditing={isEditingMode}
              key={tag.id}
              id={tag.id}
              name={tag.name}
              onEdit={(name) => handleUpdate(tag.id, name)}
              onRemove={() => handleDelete(tag.id)}
            />
          ))}
          <TagCreateChip />
        </div>
      </CardContent>
    </Card>
  );
}
