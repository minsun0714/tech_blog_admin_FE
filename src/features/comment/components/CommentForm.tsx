import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  isReply?: boolean;
  onSubmit: (content: string) => Promise<unknown> | unknown;
}

export default function CommentForm({ isReply = false, onSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await onSubmit(trimmedContent);
    setContent("");
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={isReply ? "대댓글을 입력하세요." : "댓글을 입력하세요."}
      />
      <Button size="sm" type="submit">
        {isReply ? "대댓글 등록" : "댓글 등록"}
      </Button>
    </form>
  );
}
