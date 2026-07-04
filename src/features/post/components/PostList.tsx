import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flattenCategories } from "@/features/category/category-api";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";
import PostCard from "@/features/post/components/PostCard";
import { useDeletePostMutation, usePostsByCategoryQuery, usePostsBySeriesQuery } from "@/features/post/hooks/use-posts";
import { useSeriesQuery } from "@/features/series/hooks/use-series";

type FilterType = "category" | "series";

const EMPTY_VALUE = "__empty__";

export default function PostList() {
  const [filterType, setFilterType] = useState<FilterType>("category");
  const [categoryValue, setCategoryValue] = useState(EMPTY_VALUE);
  const [seriesValue, setSeriesValue] = useState(EMPTY_VALUE);
  const { data: categories } = useCategoriesQuery();
  const { data: series } = useSeriesQuery();
  const categoryOptions = useMemo(() => flattenCategories(categories ?? []), [categories]);
  const selectedCategoryId = categoryValue === EMPTY_VALUE ? null : Number.parseInt(categoryValue, 10);
  const selectedSeriesId = seriesValue === EMPTY_VALUE ? null : Number.parseInt(seriesValue, 10);
  const categoryPostsQuery = usePostsByCategoryQuery(filterType === "category" ? selectedCategoryId : null);
  const seriesPostsQuery = usePostsBySeriesQuery(filterType === "series" ? selectedSeriesId : null);
  const deleteMutation = useDeletePostMutation();
  const activeQuery = filterType === "category" ? categoryPostsQuery : seriesPostsQuery;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>게시글 목록</CardTitle>
            <CardDescription>카테고리 또는 시리즈로 게시글을 조회합니다.</CardDescription>
          </div>
          <Link
            to="/posts/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            게시물 작성
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>조회 기준</Label>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">카테고리별</SelectItem>
                <SelectItem value="series">시리즈별</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filterType === "category" ? (
            <div className="space-y-2">
              <Label>카테고리 선택</Label>
              <Select value={categoryValue} onValueChange={setCategoryValue}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY_VALUE}>선택 안 함</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.categoryId} value={String(category.categoryId)}>
                      {`${"— ".repeat(category.depth)}${category.categoryName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>시리즈 선택</Label>
              <Select value={seriesValue} onValueChange={setSeriesValue}>
                <SelectTrigger>
                  <SelectValue placeholder="시리즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY_VALUE}>선택 안 함</SelectItem>
                  {(series ?? []).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {activeQuery.isLoading ? <p className="text-sm text-slate-400">게시글을 불러오는 중입니다.</p> : null}
        {activeQuery.isError ? <p className="text-sm text-rose-500">게시글을 불러오지 못했습니다.</p> : null}
        {!activeQuery.isLoading && !activeQuery.isError && !activeQuery.data ? (
          <p className="text-sm text-slate-400">조회 조건을 선택해주세요.</p>
        ) : null}
        {!activeQuery.isLoading && !activeQuery.isError && activeQuery.data?.length === 0 ? (
          <p className="text-sm text-slate-400">게시글이 없습니다.</p>
        ) : null}
        {!activeQuery.isLoading && !activeQuery.isError && activeQuery.data?.length ? (
          <div className="space-y-3">
            {activeQuery.data.map((post) => (
              <PostCard key={post.postId} post={post} onDelete={() => void deleteMutation.mutateAsync(post.postId)} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
