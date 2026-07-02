import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { createSeries } from "@/components/series/series-api";
import SeriesFormCard from "@/components/series/SeriesFormCard";
import SeriesTextField from "@/components/series/SeriesTextField";

export default function SeriesCreateForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      setName("");
      setFeedback("시리즈를 생성했습니다.");
    },
    onError: () => {
      setFeedback("시리즈 생성에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setFeedback("시리즈 이름을 입력해주세요.");
      return;
    }

    setFeedback(null);
    createMutation.mutate(trimmedName);
  };

  return (
    <SeriesFormCard
      title="시리즈 생성"
      description="새로운 시리즈를 추가합니다."
      feedback={feedback}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <SeriesTextField
          label="시리즈 이름"
          value={name}
          onChange={setName}
          placeholder="예: 스프링 입문"
        />

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "생성 중..." : "시리즈 생성"}
        </Button>
      </form>
    </SeriesFormCard>
  );
}
