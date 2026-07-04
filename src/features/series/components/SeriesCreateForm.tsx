import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateSeriesMutation } from "@/features/series/hooks/use-series";

export default function SeriesCreateForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const createMutation = useCreateSeriesMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setFeedback("시리즈 이름을 입력해주세요.");
      return;
    }

    try {
      await createMutation.mutateAsync(trimmedName);
      setName("");
      setFeedback("시리즈를 생성했습니다.");
    } catch {
      setFeedback("시리즈 생성에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>시리즈 생성</CardTitle>
        <CardDescription>새로운 시리즈를 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 스프링 입문" />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "생성 중..." : "시리즈 생성"}
          </Button>
          {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
