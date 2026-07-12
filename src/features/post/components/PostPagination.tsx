import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react";

export default function PostPagination({
  isFisrtPage,
  isLastPage,
  totalPages,
  currentPage,
  setSearchParams,
}: {
  isFisrtPage: boolean;
  isLastPage: boolean;
  totalPages: number;
  currentPage: number;
  setSearchParams: (params: Record<string, string>) => void;
}) {
  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));

  const end = Math.min(totalPages, start + 5);
  return (
    <Pagination>
      <PaginationContent>
        {!isFisrtPage && (
          <>
            <PaginationItem
              key="first"
              onClick={() => setSearchParams({ page: "1" })}
            >
              <PaginationLink isActive={0 === currentPage}>
                <ChevronFirst />
              </PaginationLink>
            </PaginationItem>
            <PaginationPrevious
              onClick={() => setSearchParams({ page: String(currentPage) })}
            >
              <PaginationLink>
                <ChevronLeft />
              </PaginationLink>
            </PaginationPrevious>
          </>
        )}
        {Array.from({ length: end - start }, (_, i) => {
          const page = start + i;

          return (
            <PaginationItem
              key={page}
              onClick={() => setSearchParams({ page: String(page + 1) })}
            >
              <PaginationLink isActive={page === currentPage}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {!isLastPage && (
          <>
            <PaginationNext
              onClick={() => setSearchParams({ page: String(currentPage + 2) })}
            >
              <PaginationLink>
                <ChevronRight />
              </PaginationLink>
            </PaginationNext>
            <PaginationItem
              key={"last"}
              onClick={() => setSearchParams({ page: String(totalPages) })}
            >
              <PaginationLink isActive={totalPages - 1 === currentPage}>
                <ChevronLast />
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
