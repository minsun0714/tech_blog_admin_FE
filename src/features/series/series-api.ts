import { http } from "@/lib/http";

export type Paged<T> = {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
};

export type Series = { id: number; name: string, postCount: number };

export const getSeries = (page: number = 0) =>
  http
    .get<Paged<Series>>("/api/series", { params: { page } })
    .then((r) => r.data);
export const createSeries = (name: string) =>
  http.post<{ id: number }>("/api/series", { name }).then((r) => r.data);
export const updateSeries = (id: number, name: string) =>
  http.patch(`/api/series/${id}`, { name });
export const deleteSeries = (id: number) => http.delete(`/api/series/${id}`);
