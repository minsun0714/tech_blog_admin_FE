import * as Icon from "lucide-react";
import { ToolbarButton } from "@/features/post/components/ToolBarButton";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

interface ToolBarButtonsProps {
  editor: Editor;
}

export default function ToolBarButtons({ editor }: ToolBarButtonsProps) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor.isActive("link"),
    }),
  });

  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-xl border bg-gray-50 p-3 shadow-sm">
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon.Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon.Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Icon.Strikethrough size={18} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon.Underline size={18} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Icon.Code2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Icon.Highlighter size={18} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-gray-300" />

      <ToolbarButton
        active={editorState.isLink}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl);

          if (url === null) return;

          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        <Icon.Link2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        disabled={!editorState.isLink}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Icon.Unlink size={18} />
      </ToolbarButton>
    </div>
  );
}
