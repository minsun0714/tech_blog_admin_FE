import { useState } from "react";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TagEditDialog from "@/features/tag/components/TagEditDialog";

interface TagChipProps {
  name: string;
  onEdit?: (name: string) => Promise<void> | void;
  onRemove?: () => void;
}

export default function TagChip({ name, onEdit, onRemove }: TagChipProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Badge
        className="text-left"
        onClick={() => {
          if (onEdit) {
            setOpen(true);
          }
        }}
        variant="secondary"
        removable={Boolean(onRemove)}
        onRemove={onRemove}
      >
        <Pencil className="h-3 w-3" />
        {name}
      </Badge>

      {onEdit ? (
        <TagEditDialog
          open={open}
          onOpenChange={setOpen}
          name={name}
          onSave={onEdit}
        />
      ) : null}
    </>
  );
}
