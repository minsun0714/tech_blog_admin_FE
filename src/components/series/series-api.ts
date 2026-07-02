import { http } from "@/lib/http";

export async function createSeries(name: string) {
  await http.post("/api/series", { name });
}

export async function updateSeriesName(id: number, name: string) {
  await http.patch(`/api/series/${id}`, { name });
}
