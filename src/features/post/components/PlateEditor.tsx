import { ErrorBoundary } from "react-error-boundary";
import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });
  return (
    <div className="w-full rounded-md border border-border bg-background h-[calc(100vh-700px)]">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              에디터 로딩 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.
              {error instanceof Error && (
                <span className="block text-xs text-destructive">
                  {error.message}
                </span>
              )}
            </p>
          </div>
        )}
      >
        <Plate editor={editor}>
          <EditorContainer>
            <Editor placeholder="Type your message here." />
          </EditorContainer>
        </Plate>
      </ErrorBoundary>
    </div>
  );
}
