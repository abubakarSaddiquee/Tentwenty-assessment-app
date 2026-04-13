import { baseApi } from "./api";
import type { Task } from "@/types/timesheet";

interface CreateTaskPayload {
  timesheetId: string;
  date: string;
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

interface UpdateTaskPayload {
  timesheetId: string;
  taskId: string;
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByTimesheetId: builder.query<Task[], string>({
      query: (timesheetId) => `/timesheets/${timesheetId}/tasks`,
      providesTags: (_result, _error, timesheetId) => [{ type: "Task", id: timesheetId }],
    }),

    createTask: builder.mutation<Task, CreateTaskPayload>({
      query: ({ timesheetId, ...body }) => ({
        url: `/timesheets/${timesheetId}/tasks`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { timesheetId }) => [{ type: "Task", id: timesheetId }],
    }),

    updateTask: builder.mutation<Task, UpdateTaskPayload>({
      query: ({ timesheetId, taskId, ...body }) => ({
        url: `/timesheets/${timesheetId}/tasks/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { timesheetId }) => [{ type: "Task", id: timesheetId }],
    }),

    deleteTask: builder.mutation<void, { timesheetId: string; taskId: string }>({
      query: ({ timesheetId, taskId }) => ({
        url: `/timesheets/${timesheetId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { timesheetId }) => [{ type: "Task", id: timesheetId }],
    }),
  }),
});

export const {
  useGetTasksByTimesheetIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
