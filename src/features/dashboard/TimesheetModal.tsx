"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PROJECT_OPTIONS, TYPE_OF_WORK_OPTIONS } from "./data";
import type { Timesheet, TimesheetFormValues } from "@/types/timesheet";

const schema = yup.object({
  project: yup.string().required("Project is required"),
  typeOfWork: yup.string().required("Type of work is required"),
  taskDescription: yup.string().required("Task description is required"),
  hours: yup
    .number()
    .typeError("Hours must be a number")
    .min(1, "Hours must be at least 1")
    .max(80, "Hours cannot exceed 80")
    .required("Hours is required"),
});

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TimesheetFormValues) => Promise<void>;
  editingTimesheet?: Timesheet | null;
  isSubmitting: boolean;
}

export default function TimesheetModal({
  isOpen,
  onClose,
  onSubmit,
  editingTimesheet,
  isSubmitting,
}: TimesheetModalProps) {
  const isEditing = !!editingTimesheet;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimesheetFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { project: "", typeOfWork: "", taskDescription: "", hours: 8 },
  });

  const hours = watch("hours");

  useEffect(() => {
    if (editingTimesheet) {
      reset({
        project: editingTimesheet.project || "",
        typeOfWork: editingTimesheet.typeOfWork || "",
        taskDescription: editingTimesheet.taskDescription || "",
        hours: editingTimesheet.hours || 8,
      });
    } else {
      reset({ project: "", typeOfWork: "", taskDescription: "", hours: 8 });
    }
  }, [editingTimesheet, reset]);

  const handleFormSubmit = async (values: TimesheetFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Entry" : "Add New Entry"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
            Select Project
            <span className="text-[var(--color-danger)]">*</span>
            <span className="text-[var(--color-text-muted)] cursor-help" title="Choose the project this work belongs to">ⓘ</span>
          </label>
          <select
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
            {...register("project")}
          >
            <option value="" disabled hidden>Select a project</option>
            {PROJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.project && <p className="text-xs text-[var(--color-danger)]">{errors.project.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
            Type of Work
            <span className="text-[var(--color-danger)]">*</span>
            <span className="text-[var(--color-text-muted)] cursor-help" title="Choose the type of work performed">ⓘ</span>
          </label>
          <select
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
            {...register("typeOfWork")}
          >
            <option value="" disabled hidden>Select type of work</option>
            {TYPE_OF_WORK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.typeOfWork && <p className="text-xs text-[var(--color-danger)]">{errors.typeOfWork.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Task description <span className="text-[var(--color-danger)]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Write text here..."
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors resize-none"
            {...register("taskDescription")}
          />
          {errors.taskDescription && <p className="text-xs text-[var(--color-danger)]">{errors.taskDescription.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Hours <span className="text-[var(--color-danger)]">*</span>
          </label>
          <div className="flex items-center gap-0 w-28">
            <button
              type="button"
              onClick={() => setValue("hours", Math.max(1, (hours || 1) - 1))}
              className="w-9 h-9 flex items-center justify-center border border-[var(--color-border)] rounded-l-lg bg-[var(--color-surface)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] text-lg font-medium transition-colors"
            >
              −
            </button>
            <Input
              type="number"
              className="w-16 text-center rounded-none border-x-0 border-[var(--color-border)] h-9 py-0"
              {...register("hours", { valueAsNumber: true })}
            />
            <button
              type="button"
              onClick={() => setValue("hours", Math.min(80, (hours || 0) + 1))}
              className="w-9 h-9 flex items-center justify-center border border-[var(--color-border)] rounded-r-lg bg-[var(--color-surface)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] text-lg font-medium transition-colors"
            >
              +
            </button>
          </div>
          {errors.hours && <p className="text-xs text-[var(--color-danger)]">{errors.hours.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full sm:w-1/2">
            {isEditing ? "Save Changes" : "Add Entry"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-1/2">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
