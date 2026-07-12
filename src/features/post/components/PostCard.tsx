import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Post } from "@/features/post/post-api";

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div>
          <span className="font-semibold text-slate-900 hover:text-violet-700">
            {post.title}
          </span>
          <p className="text-xs text-slate-500">ID {post.postId}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="cursor-pointer hover:bg-slate-700"
            onClick={onUpdate}
          >
            수정
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  삭제
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 이 게시물은 영구적으로
                  삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>계속</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
