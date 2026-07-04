import { http } from "@/lib/http";

export const createTag = (name: string) => http.post("/api/tags", { name });
export const updateTag = (id: number, name: string) => http.patch(`/api/tags/${id}`, { name });
export const deleteTag = (id: number) => http.delete(`/api/tags/${id}`);
