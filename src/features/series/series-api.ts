import { http } from "@/lib/http";

export type Series = { id: number; name: string };

export const getSeries = () =>
  http.get<{ seriesResponseList: Series[] }>("/api/series").then((r) => r.data.seriesResponseList);
export const createSeries = (name: string) => http.post("/api/series", { name });
export const updateSeries = (id: number, name: string) => http.patch(`/api/series/${id}`, { name });
export const deleteSeries = (id: number) => http.delete(`/api/series/${id}`);
