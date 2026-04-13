"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  useGetTimesheetsQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
} from "@/services/timesheetApi";
import { formatSingleDate } from "@/lib/utils";
import type { Timesheet, TimesheetFormValues, TimesheetStatus } from "@/types/timesheet";

function getStatus(hours: number): TimesheetStatus {
  if (!hours || hours === 0) return "MISSING";
  if (hours < 40) return "INCOMPLETE";
  return "COMPLETED";
}

export function useDashboard() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDatePickerOpen]);

  const { data, isLoading, isError, isFetching, refetch } = useGetTimesheetsQuery({
    page,
    limit,
    status: statusFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [createTimesheet, { isLoading: isCreating }] = useCreateTimesheetMutation();
  const [updateTimesheet, { isLoading: isUpdating }] = useUpdateTimesheetMutation();

  const openPicker = useCallback(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
    setIsDatePickerOpen(true);
  }, [startDate, endDate]);

  const applyDateFilter = useCallback(() => {
    setStartDate(localStart);
    setEndDate(localEnd);
    setPage(1);
    setIsDatePickerOpen(false);
  }, [localStart, localEnd]);

  const clearDateRange = useCallback(() => {
    setStartDate("");
    setEndDate("");
  }, []);

  const clearFilter = useCallback(() => {
    setLocalStart("");
    setLocalEnd("");
    clearDateRange();
    setPage(1);
  }, [clearDateRange]);

  const hasDateFilter = !!(startDate || endDate);
  const dateRangeLabel = startDate && endDate
    ? `${formatSingleDate(startDate)} — ${formatSingleDate(endDate)}`
    : startDate
    ? `From ${formatSingleDate(startDate)}`
    : endDate
    ? `To ${formatSingleDate(endDate)}`
    : "Date Range";

  const openAddModal = useCallback(() => {
    setEditingTimesheet(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((timesheet: Timesheet) => {
    setEditingTimesheet(timesheet);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTimesheet(null);
  }, []);

  const handleActionClick = useCallback((ts: Timesheet) => {
    if (ts.status === "COMPLETED") {
      router.push(`/dashboard/timesheet/${ts.id}`);
    } else if (ts.status === "INCOMPLETE") {
      openEditModal(ts);
    } else {
      openAddModal();
    }
  }, [router, openEditModal, openAddModal]);

  const handleSubmit = useCallback(async (values: TimesheetFormValues) => {
    const status = getStatus(values.hours ?? 0);

    try {
      if (editingTimesheet) {
        await updateTimesheet({ id: editingTimesheet.id, ...values, status }).unwrap();
        toast.success("Entry updated successfully");
      } else {
        const today = new Date();
        const end = new Date(today);
        end.setDate(today.getDate() + 4);
        await createTimesheet({
          project: values.project,
          typeOfWork: values.typeOfWork,
          taskDescription: values.taskDescription ?? "",
          hours: values.hours ?? 0,
          status,
          startDate: today.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        }).unwrap();
        toast.success("Entry added successfully");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Unable to save entry. Please try again.");
      throw error;
    }
  }, [editingTimesheet, updateTimesheet, createTimesheet, refetch, closeModal]);

  return {
    timesheets: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    startDate,
    endDate,
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
    isSubmitting: isCreating || isUpdating,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleActionClick,
  };
}
