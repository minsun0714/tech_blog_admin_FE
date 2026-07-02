import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { createSeries } from "@/components/series/series-api";

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
    <section className="space-y-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">시리즈 생성</h3>
        <p className="text-sm text-slate-500">새로운 시리즈를 추가합니다.</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block space-y-1 text-sm text-slate-600">
          <span>시리즈 이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            placeholder="예: 스프링 입문"
          />
        </label>

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "생성 중..." : "시리즈 생성"}
        </Button>
      </form>

      {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
    </section>
  );
}
