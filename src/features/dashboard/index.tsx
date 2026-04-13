"use client";

import Button from "@/components/ui/Button";
import Table from "@/components/common/Table";
import { STATUS_OPTIONS, PAGE_SIZE_OPTIONS, TABLE_COLUMNS } from "./data";
import { useDashboard } from "./useDashboard";
import TimesheetModal from "./TimesheetModal";
import { CalendarIcon, ChevronDown, XIcon } from "./icons";

export default function Dashboard() {
  const {
    timesheets,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    isLoading,
    isError,
    isFetching,
    hasDateFilter,
    dateRangeLabel,
    isDatePickerOpen,
    setIsDatePickerOpen,
    localStart,
    setLocalStart,
    localEnd,
    setLocalEnd,
    pickerRef,
    openPicker,
    applyDateFilter,
    clearFilter,
    isModalOpen,
    editingTimesheet,
    isSubmitting,
    openAddModal,
    closeModal,
    handleSubmit,
    handleActionClick,
  } = useDashboard();

  return (
    <>
      <main className="max-w-[1100px] mx-auto px-3 sm:px-6 pt-6 sm:pt-8 pb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">

          {/* Card Header */}
          <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 flex items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">Your Timesheets</h1>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Entry
            </button>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2">

            {/* Date Range Picker */}
            <div className="relative w-full sm:w-auto" ref={pickerRef}>
              <button
                type="button"
                onClick={() => isDatePickerOpen ? setIsDatePickerOpen(false) : openPicker()}
                className={[
                  "w-full sm:w-auto h-9 inline-flex items-center gap-2 px-3 text-sm rounded-lg border transition-colors",
                  isDatePickerOpen || hasDateFilter
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]",
                ].join(" ")}
              >
                <CalendarIcon />
                <span className="flex-1 text-left">{dateRangeLabel}</span>
                {hasDateFilter ? (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); clearFilter(); }}
                    className="ml-1 rounded-full p-0.5 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  >
                    <XIcon />
                  </span>
                ) : (
                  <ChevronDown />
                )}
              </button>

              {isDatePickerOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full sm:w-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden">
                  {/* Picker header */}
                  <div className="px-4 py-3 bg-[var(--color-primary)] flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Select Date Range</span>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <XIcon />
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* From */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        From
                      </label>
                      <input
                        type="date"
                        value={localStart}
                        max={localEnd || undefined}
                        onChange={(e) => setLocalStart(e.target.value)}
                        className="w-full h-10 pl-3 pr-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Divider with arrow */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-[var(--color-border)]" />
                      <div className="w-6 h-6 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      </div>
                      <div className="flex-1 h-px bg-[var(--color-border)]" />
                    </div>

                    {/* To */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        To
                      </label>
                      <input
                        type="date"
                        value={localEnd}
                        min={localStart || undefined}
                        onChange={(e) => setLocalEnd(e.target.value)}
                        className="w-full h-10 pl-3 pr-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { clearFilter(); setIsDatePickerOpen(false); }}
                        className="flex-1 h-9 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={applyDateFilter}
                        className="flex-1 h-9 rounded-xl bg-[var(--color-primary)] text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-auto inline-flex items-center">
              <select
                className={[
                  "appearance-none w-full sm:w-auto h-9 pl-3 pr-8 text-sm border rounded-lg bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer",
                  statusFilter
                    ? "border-[var(--color-primary)] text-[var(--color-text-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]",
                ].join(" ")}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="" disabled hidden>Status</option>
                {STATUS_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                {statusFilter && <option value="">All</option>}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <ChevronDown />
              </span>
            </div>
          </div>

          <Table
            columns={TABLE_COLUMNS}
            data={timesheets}
            isLoading={isLoading || isFetching}
            loadingRows={limit}
            emptyMessage="No timesheets found."
            errorState={
              isError ? (
                <span className="text-sm text-[var(--color-danger)]">
                  Failed to load timesheets. Please try again.
                </span>
              ) : undefined
            }
            rowClassName="hover:bg-[var(--color-background)] transition-colors"
            columnHelpers={{ actions: { onAction: handleActionClick } }}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            pageSize={limit}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
          />
        </div>
      </main>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTimesheet={editingTimesheet}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
