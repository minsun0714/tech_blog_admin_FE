import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SeriesEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onSave: (name: string) => Promise<void> | void;
}

export default function SeriesEditDialog({ open, onOpenChange, name, onSave }: SeriesEditDialogProps) {
  const [nextName, setNextName] = useState(name);

  useEffect(() => {
    setNextName(name);
  }, [name, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nextName.trim();

    if (!trimmedName) {
      return;
    }

    await onSave(trimmedName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>시리즈 수정</DialogTitle>
          <DialogDescription>시리즈 이름을 변경합니다.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input value={nextName} onChange={(event) => setNextName(event.target.value)} placeholder="새 시리즈 이름" />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
