import "@/styles/_variables.scss";

import { EditorContent, EditorContext } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Dropcursor } from "@tiptap/extensions";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { useMemo } from "react";
import ToolBarButtons from "./ToolBarButtons";
import { useUploadPostImageMutation } from "../hooks/use-post-image";

const TiptapEditor = () => {
  const { mutateAsync: handleImageUpload } = useUploadPostImageMutation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Underline,
      Code,
      Image.configure({
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Dropcursor,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 5 * 1024 * 1024, // 5MB
        limit: 10,
        upload: async (file) => {
          const { imageUrl } = await handleImageUpload(file);
          return imageUrl;
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
    ], // define your extension array
    content: "<p>Hello World!</p>", // initial content
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);
  return (
    <EditorContext.Provider value={providerValue}>
      <ToolBarButtons editor={editor} />

      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>{"f"}</FloatingMenu>
      <BubbleMenu editor={editor}>{"b"}</BubbleMenu>
    </EditorContext.Provider>
  );
};

export default TiptapEditor;
