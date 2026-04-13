import { cn } from "@/lib/utils";
import { colors } from "@/theme";
import type { TimesheetStatus } from "@/types/timesheet";

const STATUS_STYLES: Record<TimesheetStatus, { backgroundColor: string; color: string }> = {
  COMPLETED: { backgroundColor: colors.completed.bg, color: colors.completed.text },
  INCOMPLETE: { backgroundColor: colors.incomplete.bg, color: colors.incomplete.text },
  MISSING: { backgroundColor: colors.missing.bg, color: colors.missing.text },
};

const STATUS_LABELS: Record<TimesheetStatus, string> = {
  COMPLETED: "COMPLETED",
  INCOMPLETE: "INCOMPLETE",
  MISSING: "MISSING",
};

interface BadgeProps {
  status: TimesheetStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold tracking-wide",
        className
      )}
      style={STATUS_STYLES[status]}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
