import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "@/features/post/post-image-api";

export function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadPostImage(file);
      return { imageUrl: response.data.imageUrl };
    },
  });
}
