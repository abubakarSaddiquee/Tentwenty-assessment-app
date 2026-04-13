import { baseApi } from "./api";
import type {
  Timesheet,
  TimesheetListResponse,
  CreateTimesheetPayload,
  UpdateTimesheetPayload,
  TimesheetQueryParams,
} from "@/types/timesheet";

export const timesheetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheets: builder.query<TimesheetListResponse, TimesheetQueryParams>({
      query: (params) => {
        const query: Record<string, string | number> = {};
        if (params?.page) query.page = params.page;
        if (params?.limit) query.limit = params.limit;
        if (params?.status) query.status = params.status;
        if (params?.startDate) query.startDate = params.startDate;
        if (params?.endDate) query.endDate = params.endDate;
        return { url: "/timesheets", params: query };
      },
      providesTags: ["Timesheet"],
    }),

    getTimesheetById: builder.query<Timesheet, string>({
      query: (id) => `/timesheets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Timesheet", id }],
    }),

    createTimesheet: builder.mutation<Timesheet, CreateTimesheetPayload>({
      query: (body) => ({
        url: "/timesheets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Timesheet"],
    }),

    updateTimesheet: builder.mutation<Timesheet, UpdateTimesheetPayload>({
      query: ({ id, ...body }) => ({
        url: `/timesheets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Timesheet"],
    }),

    deleteTimesheet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/timesheets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timesheet"],
    }),
  }),
});

export const {
  useGetTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
} = timesheetApi;
