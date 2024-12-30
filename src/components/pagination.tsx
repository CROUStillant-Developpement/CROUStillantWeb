import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export default function PaginationComponent({
  currentPage,
  totalRecords,
  pageSize,
  loading,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("Pagination");
  const totalPages = Math.ceil(totalRecords / pageSize);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const [visibleDelta, setVisibleDelta] = useState(2); // Default delta for medium screens

  // Adjust the delta based on the screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Small screens
        setVisibleDelta(1);
      } else if (window.innerWidth < 1024) {
        // Medium screens
        setVisibleDelta(2);
      } else {
        // Large screens
        setVisibleDelta(3);
      }
    };

    handleResize(); // Set initial delta
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = visibleDelta; // Adjusted delta
    const range: number[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    // Add the first page
    range.push(1);

    // Add left ellipsis if needed
    if (left > 2) {
      range.push(-1); // Use -1 as a placeholder for ellipsis
    }

    // Add the visible range of pages
    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    // Add right ellipsis if needed
    if (right < totalPages - 1) {
      range.push(-1); // Use -1 as a placeholder for ellipsis
    }

    // Add the last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  useEffect(() => {
    if (totalPages <= 0) return;
    
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    } else if (currentPage < 1) {
      onPageChange(1);
    }
  }, [currentPage, totalPages]);

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination className="flex justify-center my-8">
      <PaginationPrevious
        isActive={hasPrevious && !loading}
        text={t("previous")}
        displayText={visibleDelta > 1}
        onClick={() => hasPrevious && onPageChange(currentPage - 1)}
        className={`${
          hasPrevious && !loading ? "cursor-pointer" : "cursor-not-allowed"
        } mr-2`}
      />
      <PaginationContent>
        {loading ? (
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        ) : (
          visiblePages.map((page, index) => {
            if (page === -1) {
              // Render ellipsis
              return <PaginationEllipsis key={`ellipsis-${index}`} />;
            }

            const isCurrent = page === currentPage;

            return (
              <PaginationItem key={page} className="cursor-pointer">
                <PaginationLink
                  isActive={isCurrent}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })
        )}
      </PaginationContent>
      <PaginationNext
        isActive={hasNext && !loading}
        displayText={visibleDelta > 1}
        text={t("next")}
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        className={`${
          hasNext && !loading ? "cursor-pointer" : "cursor-not-allowed"
        } ml-2`}
      />
    </Pagination>
  );
}
