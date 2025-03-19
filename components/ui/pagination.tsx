// components/ui/pagination.tsx

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const generatePageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        // Always show first page
        pages.push(1);

        // Calculate range for middle pages
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're at the beginning or end
        if (currentPage <= 2) {
            endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
        } else if (currentPage >= totalPages - 1) {
            startPage = Math.max(2, totalPages - maxPagesToShow + 1);
        }

        // Add ellipsis before middle pages if needed
        if (startPage > 2) {
            pages.push('ellipsis-start');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis after middle pages if needed
        if (endPage < totalPages - 1) {
            pages.push('ellipsis-end');
        }

        // Always show last page if not the first page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center space-x-1">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page, index) => {
                if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                    return (
                        <div key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9">
                            <MoreHorizontal className="h-4 w-4" />
                        </div>
                    );
                }

                return (
                    <Button
                        key={`page-${page}`}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        onClick={() => onPageChange(Number(page))}
                        className="w-9 h-9"
                    >
                        {page}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}