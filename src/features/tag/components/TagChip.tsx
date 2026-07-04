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
      <button
        type="button"
        className="text-left"
        onClick={() => {
          if (onEdit) {
            setOpen(true);
          }
        }}
      >
        <Badge variant="secondary" removable={Boolean(onRemove)} onRemove={onRemove} className="cursor-pointer">
          <Pencil className="h-3 w-3" />
          {name}
        </Badge>
      </button>
      {onEdit ? <TagEditDialog open={open} onOpenChange={setOpen} name={name} onSave={onEdit} /> : null}
    </>
  );
}
