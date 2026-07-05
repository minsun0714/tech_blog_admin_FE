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

export type TagItem = {
  id: number;
  name: string;
};

export default function TagList() {
  const { data: tags } = useFetchTags();
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
      <CardHeader>
        <CardTitle>태그 목록</CardTitle>
        <CardDescription>
          클릭하여 이름을 수정하거나 제거할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag: TagItem) => (
            <TagChip
              key={tag.id}
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
