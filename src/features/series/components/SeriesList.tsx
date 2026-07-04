import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SeriesEditDialog from "@/features/series/components/SeriesEditDialog";
import { useDeleteSeriesMutation, useSeriesQuery, useUpdateSeriesMutation } from "@/features/series/hooks/use-series";

export default function SeriesList() {
  const { data, isLoading, isError } = useSeriesQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const updateMutation = useUpdateSeriesMutation();
  const deleteMutation = useDeleteSeriesMutation();
  const currentSeries = data?.find((series) => series.id === editingId) ?? null;

  const handleUpdate = async (id: number, name: string) => {
    await updateMutation.mutateAsync({ id, name });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>시리즈 목록</CardTitle>
        <CardDescription>시리즈 이름을 수정하거나 삭제합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-slate-400">시리즈를 불러오는 중입니다.</p> : null}
        {isError ? <p className="text-sm text-rose-500">시리즈를 불러오지 못했습니다.</p> : null}
        {!isLoading && !isError && (!data || data.length === 0) ? (
          <p className="text-sm text-slate-400">시리즈가 없습니다.</p>
        ) : null}
        {!isLoading && !isError && data?.length ? (
          <div className="space-y-3">
            {data.map((series) => (
              <div
                key={series.id}
                className="flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{series.name}</p>
                  <p className="text-xs text-slate-500">ID {series.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(series.id)}>
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => void deleteMutation.mutateAsync(series.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {currentSeries ? (
          <SeriesEditDialog
            open={editingId !== null}
            onOpenChange={(open) => setEditingId(open ? editingId : null)}
            name={currentSeries.name}
            onSave={(name) => handleUpdate(currentSeries.id, name)}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
