import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "@/features/post/post-image-api";

export function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: async ({ postId, file }: { postId: number; file: File }) => {
      const response = await uploadPostImage(postId, file);
      return { imageUrl: response.data.imageUrl };
    },
  });
}
