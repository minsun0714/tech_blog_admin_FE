import { useDropzone } from "react-dropzone";
import { useUploadPostImageMutation } from "../hooks/use-post-image";
import { useEditorStore } from "@/stores/editor-store";
import { useRef } from "react";
import { createPostImageUploadUuid } from "../post-image-api";

const dropzoneStyle = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center" as const,
};

export default function ThumbnailImageDropZone() {
  const postUuidRef = useRef<string | null>(null);
  const postUuidPromiseRef = useRef<Promise<string | null> | null>(null);
  const { setPostUuid, setThumbnailImageUrl } =
    useEditorStore();
  const { mutate } = useUploadPostImageMutation();

  const handleGetUuid = async () => {
    try {
      const { data } = await createPostImageUploadUuid();
      if (data.postUuid) {
        setPostUuid(data.postUuid);
        return data.postUuid;
      } else {
        console.error("UUID를 가져오는데 실패했습니다.");
        return null;
      }
    } catch {
      console.error("UUID를 가져오는데 실패했습니다.");
      return null;
    }
  };
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!postUuidPromiseRef.current) {
      postUuidPromiseRef.current = handleGetUuid();
    }

    const newPostUuid = await postUuidPromiseRef.current;
    setPostUuid(newPostUuid);
    postUuidRef.current = newPostUuid;

    if (!postUuidRef.current) {
      throw new Error("Failed to get post UUID.");
    }

    mutate(
      {
        file,
        postUuid: postUuidRef.current,
      },
      {
        onSuccess: ({ imageUrl }) => {
          console.log("File uploaded:", imageUrl);
          setThumbnailImageUrl(imageUrl);
        },
      },
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>여기에 파일을 놓으세요...</p>
        ) : (
          <p>파일을 드래그하여 놓거나 클릭하여 파일을 선택하세요.</p>
        )}
      </div>
    </>
  );
}
