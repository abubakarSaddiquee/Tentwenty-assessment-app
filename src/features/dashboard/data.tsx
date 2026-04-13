import React from "react";
import Badge from "@/components/ui/Badge";
import type { TableColumn } from "@/components/common/Table";
import { formatDateRange } from "@/lib/utils";
import type { TimesheetStatus, Timesheet } from "@/types/timesheet";

export const STATUS_OPTIONS = [
  { value: "", label: "Status" },
  { value: "COMPLETED", label: "Completed" },
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "MISSING", label: "Missing" },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export { PROJECT_OPTIONS, TYPE_OF_WORK_OPTIONS } from "../timesheet/data";

export const STATUS_ACTION_MAP: Record<TimesheetStatus, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
};

export const STATUS_ACTION_COLOR_MAP: Record<TimesheetStatus, string> = {
  COMPLETED: "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]",
  INCOMPLETE: "text-[var(--color-warning)] hover:text-[var(--color-warning-hover)]",
  MISSING: "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]",
};

export const TABLE_COLUMNS: TableColumn<Timesheet>[] = [
  {
    key: "weekNumber",
    label: "WEEK #",
    className: "bg-[#F9FAFB] w-16",
    headerClassName: "w-16",
    render: (ts) => <span>{ts.weekNumber}</span>,
  },
  {
    key: "date",
    label: <span className="inline-flex items-center gap-1">DATE <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></span>,
    render: (ts) => <span className="text-[var(--color-text-secondary)]">{formatDateRange(ts.startDate, ts.endDate)}</span>,
  },
  {
    key: "status",
    label: <span className="inline-flex items-center gap-1">STATUS <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></span>,
    render: (ts) => <Badge status={ts.status} />,
  },
  {
    key: "actions",
    label: "ACTIONS",
    headerClassName: "text-right",
    className: "text-right",
    render: (ts, helpers) => (
      <button
        onClick={() => helpers?.onAction?.(ts)}
        className={`text-sm font-medium transition-colors cursor-pointer ${STATUS_ACTION_COLOR_MAP[ts.status]}`}
      >
        {STATUS_ACTION_MAP[ts.status]}
      </button>
    ),
  },
];
