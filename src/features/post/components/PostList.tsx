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
import { useNavigate, useSearchParams } from "react-router-dom";
import PostPagination from "@/features/post/components/PostPagination";
import { cn } from "@/lib/utils";

function PostListContent() {
  const navigate = useNavigate();
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
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = usePostsQuery(activeFilterType, selectedFilterValue);

  const { mutate: deletePost } = useDeletePostMutation();
  const publishStatus =
    searchParams.get("publishStatus") === PublishStatus.DRAFTED
      ? PublishStatus.DRAFTED
      : PublishStatus.PUBLISHED;

  const changePublishStatus = (status: PublishStatus) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("publishStatus", status);
      params.delete("page");
      return params;
    });
  };

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
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            게시글 상태
          </legend>
          <div className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1 sm:ml-auto sm:w-fit sm:min-w-72">
            {[
              { value: PublishStatus.PUBLISHED, label: "발행된 글" },
              { value: PublishStatus.DRAFTED, label: "임시저장" },
            ].map((option) => {
              const isActive = publishStatus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => changePublishStatus(option.value)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex justify-start text-sm text-slate-400">
          {isLoadingPosts ? "게시글 수 확인 중" : `총 ${postsData?.totalElements ?? 0}개`}
        </div>
        {isLoadingPosts && (
          <p className="text-sm text-slate-400">게시글을 불러오는 중입니다.</p>
        )}
        {isErrorPosts && (
          <p className="text-sm text-rose-500">게시글을 불러오지 못했습니다.</p>
        )}
        {postsData?.content.length === 0 && (
          <p className="text-sm text-slate-400">게시글이 없습니다.</p>
        )}
        <div className="space-y-3">
          {postsData?.content.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onUpdate={() => navigate(`/posts/${post.postId}/edit`)}
              onDelete={() => deletePost(post.postId)}
            />
          ))}
        </div>
      </CardContent>
      <PostPagination
        isFisrtPage={postsData?.first || false}
        isLastPage={postsData?.last || false}
        totalPages={postsData?.totalPages || 0}
        currentPage={postsData?.number || 0}
        setSearchParams={setSearchParams}
      />
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
