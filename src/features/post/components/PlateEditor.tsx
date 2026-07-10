import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });
  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor placeholder="Type your message here." />
      </EditorContainer>
    </Plate>
  );
}
