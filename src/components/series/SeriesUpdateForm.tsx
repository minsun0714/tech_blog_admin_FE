import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { updateSeriesName } from "@/components/series/series-api";

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
    <section className="space-y-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">시리즈 수정</h3>
        <p className="text-sm text-slate-500">기존 시리즈의 이름을 변경합니다.</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block space-y-1 text-sm text-slate-600">
          <span>시리즈 ID</span>
          <input
            value={id}
            onChange={(event) => setId(event.target.value)}
            className="h-10 w-full rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            placeholder="예: 1"
            inputMode="numeric"
          />
        </label>

        <label className="block space-y-1 text-sm text-slate-600">
          <span>새 이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            placeholder="예: 고급 스프링"
          />
        </label>

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "수정 중..." : "시리즈 수정"}
        </Button>
      </form>

      {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
    </section>
  );
}
