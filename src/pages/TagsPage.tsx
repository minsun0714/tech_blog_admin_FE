import TagCreateForm from "@/features/tag/components/TagCreateForm";
import TagList from "@/features/tag/components/TagList";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">태그 관리</h2>
        <p className="text-sm text-slate-500">태그를 추가하거나 삭제합니다.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TagCreateForm />
        <TagList />
      </div>
    </div>
  );
}
