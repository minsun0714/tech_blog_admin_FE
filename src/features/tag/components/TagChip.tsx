import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TagEditDialog from "@/features/tag/components/TagEditDialog";
import { cn } from "@/lib/utils";

interface TagChipProps {
  isEditing?: boolean;
  id: number;
  name: string;
  onEdit?: (name: string) => Promise<void> | void;
  onRemove?: () => void;
}

export default function TagChip({
  isEditing,
  id,
  name,
  onEdit,
  onRemove,
}: TagChipProps) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <Badge
        className={cn(
          "*:cursor-pointer px-5 py-2 text-sm",
          isEditing && "bg-slate-100 px-4 py-2 text-sm",
        )}
        onClick={() => {
          if (isEditing && onEdit) {
            setOpen(true);
            return;
          }
          navigate(`/posts?type=tag&value=${id}`);
        }}
        variant="secondary"
        removable={isEditing}
        onRemove={onRemove}
      >
        {isEditing && <Pencil className="mr-1 h-3.5 w-3.5" />}
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
