import CategoryCreateForm from "@/features/category/components/CategoryCreateForm";
import CategoryTree from "@/features/category/components/CategoryTree";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">카테고리 관리</h2>
        <p className="text-sm text-slate-500">카테고리를 추가하거나 삭제합니다.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryCreateForm />
        <CategoryTree />
      </div>
    </div>
  );
}
