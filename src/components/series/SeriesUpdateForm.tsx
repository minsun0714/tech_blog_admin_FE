import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { updateSeriesName } from "@/components/series/series-api";
import SeriesFormCard from "@/components/series/SeriesFormCard";
import SeriesTextField from "@/components/series/SeriesTextField";

interface UpdateSeriesPayload {
  id: number;
  name: string;
}

export default function SeriesUpdateForm() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: ({ id: seriesId, name: seriesName }: UpdateSeriesPayload) =>
      updateSeriesName(seriesId, seriesName),
    onSuccess: () => {
      setFeedback("시리즈 이름을 수정했습니다.");
    },
    onError: () => {
      setFeedback("시리즈 수정에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedId = Number(id);
    const trimmedName = name.trim();

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setFeedback("올바른 시리즈 ID를 입력해주세요.");
      return;
    }

    if (!trimmedName) {
      setFeedback("수정할 시리즈 이름을 입력해주세요.");
      return;
    }

    setFeedback(null);
    updateMutation.mutate({ id: parsedId, name: trimmedName });
  };

  return (
    <SeriesFormCard
      title="시리즈 수정"
      description="기존 시리즈의 이름을 변경합니다."
      feedback={feedback}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <SeriesTextField
          label="시리즈 ID"
          value={id}
          onChange={setId}
          placeholder="예: 1"
          inputMode="numeric"
        />

        <SeriesTextField
          label="새 이름"
          value={name}
          onChange={setName}
          placeholder="예: 고급 스프링"
        />

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "수정 중..." : "시리즈 수정"}
        </Button>
      </form>
    </SeriesFormCard>
  );
}
