"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { UploadedImage, useEditorStore } from "@/stores/editor-store";

async function fetchUploads(): Promise<UploadedImage[]> {
  const response = await fetch("/api/uploads", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("이미지 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return response.json();
}

const columns: ColumnDef<UploadedImage>[] = [
  {
    accessorKey: "fileName",
    header: "파일명",
  },
  {
    accessorKey: "size",
    header: "크기(KB)",
    cell: ({ row }) => `${Math.max(1, Math.round(row.original.size / 1024))}`,
  },
  {
    accessorKey: "uploadedAt",
    header: "업로드 시각",
    cell: ({ row }) => new Date(row.original.uploadedAt).toLocaleString(),
  },
  {
    accessorKey: "url",
    header: "미리보기",
    cell: ({ row }) => (
      <a
        className="font-medium text-violet-700 underline"
        href={row.original.url}
        target="_blank"
        rel="noreferrer"
      >
        보기
      </a>
    ),
  },
];

export default function PostEditor() {
  const queryClient = useQueryClient();
  const { title, content, uploadedImages, setTitle, setContent, setUploadedImages } =
    useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const uploadsQuery = useQuery({
    queryKey: ["uploads"],
    queryFn: fetchUploads,
  });

  useEffect(() => {
    setUploadedImages(uploadsQuery.data ?? []);
  }, [uploadsQuery.data, setUploadedImages]);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: async (uploaded) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? content.length;
      const end = textarea?.selectionEnd ?? content.length;
      const markdown = `\n![${uploaded.fileName}](${uploaded.url})\n`;
      const nextContent = `${content.slice(0, start)}${markdown}${content.slice(end)}`;
      setContent(nextContent);
      setErrorMessage(null);
      await queryClient.invalidateQueries({ queryKey: ["uploads"] });

      if (textarea) {
        const cursor = start + markdown.length;
        requestAnimationFrame(() => textarea.setSelectionRange(cursor, cursor));
      }
    },
    onError: () => {
      setErrorMessage("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const table = useReactTable({
    data: uploadedImages,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const previewImages = useMemo(
    () => Array.from(content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g), (match) => match[1]),
    [content],
  );

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .forEach((file) => uploadMutation.mutate(file));
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    handleFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length === 0) {
      return;
    }

    handleFiles(event.dataTransfer.files);
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 bg-gradient-to-b from-violet-50 to-white p-4 text-slate-900 md:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-violet-700">Tech Blog Admin</p>
        <h1 className="text-3xl font-bold tracking-tight">게시물 에디터</h1>
        <p className="text-sm text-slate-600">
          가장 가벼운 방식으로 Next.js 기본 textarea를 에디터로 사용하고, 실시간 미리보기와
          드래그 앤 드롭 이미지 업로드를 제공합니다.
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

          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="content">
              본문
            </label>
            <label className="cursor-pointer rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 hover:bg-violet-200">
              이미지 추가
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInput}
                multiple
              />
            </label>
          </div>

          <textarea
            id="content"
            ref={textareaRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`h-80 w-full rounded-xl border px-4 py-3 font-medium outline-none ring-violet-300 transition focus:ring ${
              isDragging ? "border-violet-500 bg-violet-50" : "border-violet-200"
            }`}
            placeholder="마크다운으로 작성하세요.\n이미지를 드래그해서 놓으면 즉시 업로드됩니다."
          />

          {uploadMutation.isPending ? (
            <p className="text-sm text-violet-700">이미지를 업로드하는 중입니다...</p>
          ) : null}
          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
        </article>

        <article className="space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">실시간 미리보기</h2>
          <h3 className="text-2xl font-semibold text-violet-950">{title || "제목을 입력하세요"}</h3>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {content || "본문을 입력하면 이 영역에서 즉시 확인할 수 있습니다."}
          </p>

          {previewImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {previewImages.map((url) => (
                <Image
                  key={url}
                  src={url}
                  alt="업로드 미리보기"
                  width={320}
                  height={144}
                  className="h-36 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : null}
        </article>
      </section>

      <section className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">업로드된 이미지 목록</h2>
        {uploadsQuery.isLoading ? <p className="text-sm text-slate-500">불러오는 중...</p> : null}
        {uploadsQuery.isError ? (
          <p className="text-sm text-rose-600">이미지 목록을 불러오지 못했습니다.</p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-1 font-semibold text-slate-600">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="rounded-lg bg-violet-50/60">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
