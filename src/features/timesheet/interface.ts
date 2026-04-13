import type { Task } from "@/types/timesheet";

export interface TimesheetTaskGroup {
  label: string;
  date: string;
  tasks: Task[];
}
