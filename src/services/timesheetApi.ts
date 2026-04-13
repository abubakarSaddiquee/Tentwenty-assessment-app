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
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.status) searchParams.set("status", params.status);
        if (params?.startDate) searchParams.set("startDate", params.startDate);
        if (params?.endDate) searchParams.set("endDate", params.endDate);
        return `/timesheets?${searchParams.toString()}`;
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
