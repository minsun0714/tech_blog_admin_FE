import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateTagMutation, useTagStore } from "@/features/tag/hooks/use-tags";

export default function TagCreateForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const tags = useTagStore((state) => state.tags);
  const createMutation = useCreateTagMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("태그 이름을 입력해주세요.");
      return;
    }

    if (tags.some((tag) => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      setMessage("이미 추가된 태그입니다.");
      return;
    }

    try {
      await createMutation.mutateAsync(trimmedName);
      setName("");
      setMessage("태그를 추가했습니다.");
    } catch {
      setMessage("태그 생성에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>태그 추가</CardTitle>
        <CardDescription>새 태그를 만들고 현재 목록에 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: react" />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </div>
          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
