import { KeyboardEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PostTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function PostTagInput({ value, onChange }: PostTagInputProps) {
  const [input, setInput] = useState("");

  const appendTag = () => {
    const normalized = input.trim().replace(/,$/, "");

    if (!normalized || value.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
      setInput("");
      return;
    }

    onChange([...value, normalized]);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      appendTag();
    }

    if (event.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-3">
      <Input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="태그 입력 후 Enter 또는 쉼표"
      />
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" removable onRemove={() => onChange(value.filter((item) => item !== tag))}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
