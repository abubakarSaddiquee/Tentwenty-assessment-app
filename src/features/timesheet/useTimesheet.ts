"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useGetTimesheetByIdQuery } from "@/services/timesheetApi";
import {
  useGetTasksByTimesheetIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/services/taskApi";
import { addDays, formatDayLabel } from "./data";
import type { TimesheetTaskGroup } from "./interface";
import type { Task, TaskFormValues } from "@/types/timesheet";

export function useTimesheetDetail() {
  const params = useParams() as { id?: string };
  const timesheetId = params.id || "";

  const { data: timesheet, isLoading, isError } = useGetTimesheetByIdQuery(timesheetId, {
    skip: !timesheetId,
  });

  const { data: tasks = [] } = useGetTasksByTimesheetIdQuery(timesheetId, {
    skip: !timesheetId,
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const taskGroups = useMemo((): TimesheetTaskGroup[] => {
    if (!timesheet) return [];
    const start = new Date(timesheet.startDate);
    return Array.from({ length: 5 }, (_, index) => {
      const date = addDays(start, index);
      const dateStr = date.toISOString().split("T")[0];
      const dayTasks = tasks.filter((t) => t.date === dateStr);
      return {
        label: formatDayLabel(date),
        date: dateStr,
        tasks: dayTasks,
      };
    });
  }, [timesheet, tasks]);

  const progressValue = useMemo(() => {
    if (!timesheet) return 0;
    const total = tasks.reduce((sum, t) => sum + t.hours, 0);
    return Math.min(100, Math.round((total / 40) * 100));
  }, [timesheet, tasks]);

  const totalHours = useMemo(() => tasks.reduce((sum, t) => sum + t.hours, 0), [tasks]);

  const openAddModal = useCallback((date: string) => {
    setEditingTask(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setSelectedDate(task.date);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedDate("");
  }, []);

  const handleSubmit = useCallback(async (values: TaskFormValues) => {
    try {
      if (editingTask) {
        await updateTask({
          timesheetId,
          taskId: editingTask.id,
          project: values.project,
          typeOfWork: values.typeOfWork,
          taskDescription: values.taskDescription ?? "",
          hours: values.hours ?? 0,
        }).unwrap();

        toast.success("Task updated successfully");
      } else {
        await createTask({
          timesheetId,
          date: selectedDate,
          project: values.project,
          typeOfWork: values.typeOfWork,
          taskDescription: values.taskDescription ?? "",
          hours: values.hours ?? 0,
        }).unwrap();

        toast.success("Task added successfully");
      }

      closeModal();
    } catch (error) {
      toast.error("Unable to save task. Please try again.");
      throw error;
    }
  }, [editingTask, timesheetId, selectedDate, createTask, updateTask, closeModal]);

  const handleDelete = useCallback(async (taskId: string) => {
    try {
      await deleteTask({ timesheetId, taskId }).unwrap();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Unable to delete task. Please try again.");
      throw error;
    }
  }, [timesheetId, deleteTask]);

  return {
    timesheet,
    isLoading,
    isError,
    taskGroups,
    progressValue,
    totalHours,
    isModalOpen,
    editingTask,
    isSubmitting: isCreating || isUpdating,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}
