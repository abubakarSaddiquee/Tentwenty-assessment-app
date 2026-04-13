"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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

  // Pagination & filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null);

  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close date picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDatePickerOpen]);

  const { data, isLoading, isError, isFetching } = useGetTimesheetsQuery({
    page,
    limit,
    status: statusFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [createTimesheet, { isLoading: isCreating }] = useCreateTimesheetMutation();
  const [updateTimesheet, { isLoading: isUpdating }] = useUpdateTimesheetMutation();

  // Date picker actions
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

  // Derived date display values
  const hasDateFilter = !!(startDate || endDate);
  const dateRangeLabel = startDate && endDate
    ? `${formatSingleDate(startDate)} — ${formatSingleDate(endDate)}`
    : startDate
    ? `From ${formatSingleDate(startDate)}`
    : endDate
    ? `To ${formatSingleDate(endDate)}`
    : "Date Range";

  // Modal actions
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

  // Table action handler
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
    const status = getStatus(values.hours);
    if (editingTimesheet) {
      await updateTimesheet({ id: editingTimesheet.id, ...values, status });
    } else {
      const today = new Date();
      const end = new Date(today);
      end.setDate(today.getDate() + 4);
      await createTimesheet({
        ...values,
        status,
        startDate: today.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      });
    }
    closeModal();
  }, [editingTimesheet, updateTimesheet, createTimesheet, closeModal]);

  return {
    // Data
    timesheets: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError,
    isFetching,
    // Pagination
    page,
    setPage,
    limit,
    setLimit,
    // Status filter
    statusFilter,
    setStatusFilter,
    // Date filter
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
    clearDateRange,
    // Modal
    isModalOpen,
    editingTimesheet,
    isSubmitting: isCreating || isUpdating,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    // Table
    handleActionClick,
  };
}
