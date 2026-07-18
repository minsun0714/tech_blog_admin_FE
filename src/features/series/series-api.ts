import { http } from "@/lib/http";
import { Paged } from '../post/post-api';

export type Series = { id: number; name: string };

export const getSeries = () =>
  http
    .get<Paged<Series>>("/api/series")
    .then((r) => r.data);
export const createSeries = (name: string) =>
  http.post<{ id: number }>("/api/series", { name }).then((r) => r.data);
export const updateSeries = (id: number, name: string) =>
  http.patch(`/api/series/${id}`, { name });
export const deleteSeries = (id: number) => http.delete(`/api/series/${id}`);
