export async function createSeries(name: string) {
  const response = await fetch("/api/series", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("시리즈 생성에 실패했습니다.");
  }
}

export async function updateSeriesName(id: number, name: string) {
  const response = await fetch(`/api/series/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("시리즈 수정에 실패했습니다.");
  }
}
