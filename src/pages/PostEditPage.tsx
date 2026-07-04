import { useMemo } from "react";
import { useParams } from "react-router-dom";
import PostForm from "@/features/post/components/PostForm";

export default function PostEditPage() {
  const params = useParams();
  const postId = useMemo(() => {
    const rawId = params.id;
    return rawId && /^\d+$/.test(rawId) ? Number.parseInt(rawId, 10) : undefined;
  }, [params.id]);

  return <PostForm postId={postId} />;
}
