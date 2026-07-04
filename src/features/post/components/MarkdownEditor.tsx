import { DragEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageDrop?: (file: File, cursorPosition: number) => void;
}

export default function MarkdownEditor({ value, onChange, onImageDrop }: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (!onImageDrop) {
      return;
    }

    const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    let cursorPosition = event.currentTarget.selectionStart ?? value.length;

    files.forEach((file) => {
      onImageDrop(file, cursorPosition);
      cursorPosition += 1;
    });
  };

  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn("min-h-[320px] font-medium leading-7", isDragging && "border-violet-400 ring-2 ring-violet-200")}
      placeholder="마크다운으로 작성하세요. 이미지를 드롭하면 본문에 링크가 삽입됩니다."
    />
  );
}
