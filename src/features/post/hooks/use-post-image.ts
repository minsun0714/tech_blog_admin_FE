import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "@/features/post/post-image-api";

export function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: async ({
      file,
      postUuid,
    }: {
      file: File;
      postUuid: string;
    }) => {
      const response = await uploadPostImage(file, postUuid);
      return { imageUrl: response.data.imageUrl };
    },
  });
}
