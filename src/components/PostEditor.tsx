import { useNavigate } from "react-router-dom";
import { useEditorStore } from "@/stores/editor-store";

export default function PostEditor() {
  const { title, content, setTitle, setContent } = useEditorStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">게시물 작성</h2>
          <p className="text-sm text-slate-500">
            React 기본 textarea로 작성하고 실시간으로 미리봅니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          목록으로
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-violet-200 px-4 py-3 outline-none ring-violet-300 transition focus:ring"
            placeholder="게시물 제목"
          />

          <label className="text-sm font-semibold text-slate-700" htmlFor="content">
            본문
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="h-80 w-full rounded-xl border border-violet-200 px-4 py-3 font-medium outline-none ring-violet-300 transition focus:ring"
            placeholder="마크다운으로 작성하세요."
          />
        </article>

        <article className="space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">실시간 미리보기</h2>
          <h3 className="text-2xl font-semibold text-violet-950">{title || "제목을 입력하세요"}</h3>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {content || "본문을 입력하면 이 영역에서 즉시 확인할 수 있습니다."}
          </p>
        </article>
      </section>
    </div>
  );
}
