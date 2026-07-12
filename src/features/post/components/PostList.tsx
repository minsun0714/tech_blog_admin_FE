import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublishStatus,
  useDeletePostMutation,
  usePostsQuery,
} from "@/features/post/hooks/use-posts";
import { FilterType } from "@/lib/type";
import PostCard from "./PostCard";
import {
  FILTER_CONFIG,
  PostFilterProvider,
  usePostFilter,
} from "@/features/post/context/PostFilterContext";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "react-router-dom";

function PostListContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    activeFilterType,
    selectedFilterValue,
    placeholder,
    options,
    isLoadingOptions,
    changeFilterType,
    changeFilterValue,
  } = usePostFilter();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = usePostsQuery(activeFilterType, selectedFilterValue);

  const { mutate: deletePost } = useDeletePostMutation();

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>조회 기준</Label>
            <Select
              value={activeFilterType}
              onValueChange={(val: FilterType) => changeFilterType(val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FILTER_CONFIG).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>선택</Label>
            <Select
              value={selectedFilterValue ? String(selectedFilterValue) : "all"}
              onValueChange={changeFilterValue}
              disabled={isLoadingOptions}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoadingOptions ? "로딩 중..." : placeholder}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">선택 안 함</SelectItem>
                {options.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-6 w-full ">
          <Label>임시저장된 게시물 조회</Label>
          <Switch
            defaultChecked={
              searchParams.get("publishStatus") !== PublishStatus.DRAFTED
            }
            onCheckedChange={(checked) => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set(
                  "publishStatus",
                  checked ? PublishStatus.PUBLISHED : PublishStatus.DRAFTED,
                );
                return params;
              });
            }}
          />
          <Label>저장된 게시물 조회</Label>
        </div>
        {isLoadingPosts && (
          <p className="text-sm text-slate-400">게시글을 불러오는 중입니다.</p>
        )}
        {isErrorPosts && (
          <p className="text-sm text-rose-500">게시글을 불러오지 못했습니다.</p>
        )}
        {posts?.length === 0 && (
          <p className="text-sm text-slate-400">게시글이 없습니다.</p>
        )}
        <div className="space-y-3">
          {posts?.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onDelete={() => deletePost(post.postId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PostList() {
  return (
    <PostFilterProvider>
      <PostListContent />
    </PostFilterProvider>
  );
}
