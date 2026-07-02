import { useState, useMemo } from "react";

export function useClientPagination<T>(items: T[], itemsPerPage: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevLength, setPrevLength] = useState(items.length);

  // Sync state during render phase if the length of items changes (e.g., search/filter is applied)
  if (items.length !== prevLength) {
    setPrevLength(items.length);
    setCurrentPage(1);
  }

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);

  // Ensure current page does not exceed total pages
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedItems = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, activePage, itemsPerPage]);

  return {
    currentPage: activePage,
    totalPages,
    paginatedItems,
    onPageChange: setCurrentPage,
  };
}
