export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  project?: string;
  typeOfWork?: string;
  taskDescription?: string;
  hours?: number;
}

export interface TimesheetListResponse {
  data: Timesheet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimesheetQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTimesheetPayload {
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
}

export interface UpdateTimesheetPayload extends Partial<CreateTimesheetPayload> {
  id: string;
}

export interface TimesheetFormValues {
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

export interface Task {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

export interface TaskFormValues {
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

