import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });
  return (
    <div className="w-full rounded-md border border-border bg-background h-[calc(100vh-700px)]">
      <Plate editor={editor}>
          <EditorContainer>
            <Editor placeholder="Type your message here." />
          </EditorContainer>
      </Plate>
    </div>
  );
}
