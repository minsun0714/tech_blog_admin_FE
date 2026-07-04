import ApiKeyInputBar from "@/components/api-key/ApiKeyInputBar";

export default function MainHeader() {
  return (
    <header className="mb-6 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-800">관리자 콘솔</p>
        <ApiKeyInputBar />
      </div>
    </header>
  );
}
