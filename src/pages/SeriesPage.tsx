import SeriesCreateForm from "@/features/series/components/SeriesCreateForm";
import SeriesList from "@/features/series/components/SeriesList";

export default function SeriesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">시리즈 관리</h2>
        <p className="text-sm text-slate-500">시리즈를 생성하고 이름을 수정합니다.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SeriesCreateForm />
        <SeriesList />
      </div>
    </div>
  );
}
