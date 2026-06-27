"use client";

import { useEditorStore } from "@/stores/editor-store";

export default function PostEditor() {
  const { title, content, setTitle, setContent } = useEditorStore();

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 bg-gradient-to-b from-violet-50 to-white p-4 text-slate-900 md:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-violet-700">Tech Blog Admin</p>
        <h1 className="text-3xl font-bold tracking-tight">게시물 에디터</h1>
        <p className="text-sm text-slate-600">
          가장 가벼운 방식으로 Next.js 기본 textarea를 에디터로 사용하고 실시간 미리보기를
          제공합니다.
        </p>
      </header>

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
    </main>
  );
}
