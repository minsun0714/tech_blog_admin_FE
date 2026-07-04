import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TagChip from "@/features/tag/components/TagChip";
import { useDeleteTagMutation, useTagStore, useUpdateTagMutation } from "@/features/tag/hooks/use-tags";

export default function TagList() {
  const tags = useTagStore((state) => state.tags);
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
        <CardDescription>클릭하여 이름을 수정하거나 제거할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <p className="text-sm text-slate-400">태그가 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                onEdit={(name) => handleUpdate(tag.id, name)}
                onRemove={() => void handleDelete(tag.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
