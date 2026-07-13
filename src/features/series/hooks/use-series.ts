import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createSeries,
  deleteSeries,
  getSeries,
  updateSeries,
} from "@/features/series/series-api";
import { useSearchParams } from "react-router-dom";

export function useSeriesQuery({ enabled }: { enabled?: boolean } = {}) {
  const [searchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) - 1 : 0;

  return useQuery({
    queryKey: ["series", page],
    queryFn: () => getSeries(page),
    enabled,
  });
}

export function useCreateSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      toast.success("시리즈가 생성되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
    onError: () => {
      toast.error("시리즈 생성에 실패했습니다.");
    },
  });
}

export function useUpdateSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateSeries(id, name),
    onSuccess: () => {
      toast.success("시리즈가 수정되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
    onError: () => {
      toast.error("시리즈 수정에 실패했습니다.");
    },
  });
}

export function useDeleteSeriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeries,
    onSuccess: () => {
      toast.success("시리즈가 삭제되었습니다.");
      void queryClient.invalidateQueries({ queryKey: ["series"] });
    },
    onError: () => {
      toast.error("시리즈 삭제에 실패했습니다.");
    },
  });
}
