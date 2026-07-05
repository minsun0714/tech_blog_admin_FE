import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterType } from "@/lib/type";
import { useCategoriesQuery } from "@/features/category/hooks/use-categories";
import { useFetchTags } from "@/features/tag/hooks/use-tags";
import { flattenCategories } from "@/features/category/category-api";
import { useSeriesQuery } from "@/features/series/hooks/use-series";

export interface FilterOption {
  id: number;
  name: string;
}

export const FILTER_CONFIG: Record<
  FilterType,
  { label: string; placeholder: string }
> = {
  category: { label: "카테고리별", placeholder: "카테고리 선택" },
  series: { label: "시리즈별", placeholder: "시리즈 선택" },
  tag: { label: "태그별", placeholder: "태그 선택" },
};

const FILTER_TRANSFORMS = {
  category: (data: unknown) =>
    flattenCategories((data as Parameters<typeof flattenCategories>[0]) ?? []),
  series: (data: unknown) => (data as FilterOption[] | undefined) ?? [],
  tag: (data: unknown) => (data as FilterOption[] | undefined) ?? [],
} satisfies Record<FilterType, (data: unknown) => FilterOption[]>;

function useAllFilterQueries(activeFilterType: FilterType) {
  const category = useCategoriesQuery({
    enabled: activeFilterType === "category",
  });
  const series = useSeriesQuery({ enabled: activeFilterType === "series" });
  const tag = useFetchTags({ enabled: activeFilterType === "tag" });
  return { category, series, tag } as const;
}

interface FilterContextType {
  activeFilterType: FilterType;
  selectedFilterValue: number | null;
  label: string;
  placeholder: string;
  options: FilterOption[];
  isLoadingOptions: boolean;
  changeFilterType: (type: FilterType) => void;
  changeFilterValue: (value: string) => void;
}

const PostFilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

function readActiveFilterType(searchParams: URLSearchParams): FilterType {
  const type = searchParams.get("type") as FilterType;
  return FILTER_CONFIG[type] ? type : "category";
}

export function PostFilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilterType = readActiveFilterType(searchParams);
  const selectedFilterValue = searchParams.get("value")
    ? Number(searchParams.get("value"))
    : null;

  const queries = useAllFilterQueries(activeFilterType);
  const activeQuery = queries[activeFilterType];

  const options = useMemo(
    () => FILTER_TRANSFORMS[activeFilterType](activeQuery.data),
    [activeFilterType, activeQuery.data],
  );

  const { label, placeholder } = FILTER_CONFIG[activeFilterType];

  const changeFilterType = (type: FilterType) => {
    setSearchParams({ type, value: "" });
  };

  const changeFilterValue = (value: string) => {
    const params: Record<string, string | string[]> =
      !value || value === "all"
        ? { type: activeFilterType }
        : { type: activeFilterType, value };
    setSearchParams(params);
  };

  return (
    <PostFilterContext.Provider
      value={{
        activeFilterType,
        selectedFilterValue,
        label,
        placeholder,
        options,
        isLoadingOptions: activeQuery.isLoading,
        changeFilterType,
        changeFilterValue,
      }}
    >
      {children}
    </PostFilterContext.Provider>
  );
}

export function usePostFilter() {
  const context = useContext(PostFilterContext);
  if (!context) {
    throw new Error("usePostFilter must be used within PostFilterProvider");
  }
  return context;
}
