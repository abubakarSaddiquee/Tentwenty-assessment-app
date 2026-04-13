"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TableColumn<T = any> {
  key: string;
  label: ReactNode;
  className?: string;
  headerClassName?: string;
  render?: (item: T, helpers?: any) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  renderRow?: (item: T, index: number) => ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  errorState?: ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
  rowClassName?: string;
  columnHelpers?: Record<string, any>;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  maxPageButtons?: number;
}

export default function Table<T>({
  columns,
  data,
  renderRow,
  isLoading = false,
  loadingRows = 5,
  emptyMessage = "No records found.",
  errorState,
  wrapperClassName,
  tableClassName,
  rowClassName,
  columnHelpers,
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  maxPageButtons = 8,
}: TableProps<T>) {
  const normalizedPage = typeof page === "number" && page > 0 ? page : 1;
  const resolvedTotalPages = totalPages;
  const paginateClientSide = pageSize && !totalPages && typeof page === "number";
  const pagedData = paginateClientSide
    ? data.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize)
    : data;

  const paginationEnabled = typeof page === "number" && typeof resolvedTotalPages === "number" && typeof onPageChange === "function";
  const pageSizeEnabled = typeof pageSize === "number" && Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 && typeof onPageSizeChange === "function";

  const pageNumbers = paginationEnabled
    ? (() => {
        if (resolvedTotalPages <= maxPageButtons) {
          return Array.from({ length: resolvedTotalPages }, (_, i) => i + 1);
        }
        const firstPage = 1;
        const lastPage = resolvedTotalPages;
        const siblings = 1;
        const startPage = Math.max(firstPage + 1, normalizedPage - siblings);
        const endPage = Math.min(lastPage - 1, normalizedPage + siblings);
        const pages: number[] = [firstPage];
        if (startPage > firstPage + 1) pages.push(-1);
        for (let p = startPage; p <= endPage; p++) pages.push(p);
        if (endPage < lastPage - 1) pages.push(-1);
        pages.push(lastPage);
        return pages;
      })()
    : [];

  const renderDefaultRow = (item: T, index: number) => (
    <tr
      key={`row-${index}`}
      className={cn("bg-[var(--color-surface)]", rowClassName)}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={cn("px-4 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap", column.className)}
        >
          {column.render
            ? column.render(item, columnHelpers?.[column.key])
            : String((item as any)[column.key] ?? "")}
        </td>
      ))}
    </tr>
  );

  return (
    <div className={cn("overflow-hidden", wrapperClassName)}>
      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[480px] border-collapse", tableClassName)}>
          <thead>
            <tr className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase whitespace-nowrap",
                    column.headerClassName
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--color-divider)]">
            {isLoading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 sm:px-6 py-3 sm:py-4", column.className)}>
                      <div className="h-4 bg-[var(--color-divider)] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : errorState ? (
              <tr>
                <td colSpan={columns.length} className="px-4 sm:px-6 py-10 text-center text-sm">
                  {errorState}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 sm:px-6 py-10 text-center text-sm text-[var(--color-text-muted)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : renderRow ? (
              pagedData.map(renderRow)
            ) : (
              pagedData.map(renderDefaultRow)
            )}
          </tbody>
        </table>
      </div>

      {(paginationEnabled || pageSizeEnabled) && (
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-[var(--color-border)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {pageSizeEnabled && (
            <div className="relative inline-flex items-center w-full sm:w-auto">
              <select
                className="appearance-none h-8 w-full sm:w-auto pl-3 pr-7 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((s) => (
                  <option key={s} value={s}>{s} per page</option>
                ))}
              </select>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
          )}

          {paginationEnabled && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, normalizedPage - 1))}
                disabled={normalizedPage === 1}
                className="px-2 sm:px-3 h-8 rounded-lg border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {pageNumbers.map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <span key={`dots-${index}`} className="text-[var(--color-text-muted)] px-1 text-sm select-none">…</span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => onPageChange(pageNumber)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                      pageNumber === normalizedPage
                        ? "bg-[var(--color-primary)] text-[var(--color-surface)]"
                        : "text-[var(--color-text-primary)] hover:bg-[var(--color-background)] border border-[var(--color-border)]"
                    )}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => onPageChange(Math.min(resolvedTotalPages, normalizedPage + 1))}
                disabled={normalizedPage >= resolvedTotalPages}
                className="px-2 sm:px-3 h-8 rounded-lg border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
