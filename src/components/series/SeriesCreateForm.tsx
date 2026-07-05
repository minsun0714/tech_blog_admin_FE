import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { createSeries } from "@/components/series/series-api";
import SeriesTextField from "@/components/series/SeriesTextField";

export default function SeriesCreateForm() {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
    onError: () => {},
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    createMutation.mutate(trimmedName);
  };

  return (
    <form
      className="flex justify-end items-center space-y-3"
      onSubmit={handleSubmit}
    >
      <SeriesTextField
        label="시리즈 추가"
        value={name}
        onChange={setName}
        placeholder="예: 스프링 입문"
      />

      <Button
        className="p-5"
        size="lg"
        type="submit"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "생성 중..." : "시리즈 생성"}
      </Button>
    </form>
  );
}
