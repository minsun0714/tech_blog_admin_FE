import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSeries,
  deleteSeries,
  getSeries,
  updateSeries,
} from "@/features/series/series-api";

export function useSeriesQuery({ enabled }: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: ["series"], queryFn: getSeries, enabled });
}

export function useCreateSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
}

export function useUpdateSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateSeries(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
}

export function useDeleteSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeries,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
}
