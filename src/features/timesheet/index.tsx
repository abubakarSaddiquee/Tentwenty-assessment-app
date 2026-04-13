"use client";

import { formatDateRange } from "@/lib/utils";
import { useTimesheetDetail } from "./useTimesheet";
import TaskModal from "./TaskModal";
import { ThreeDotMenu } from "./components";
import type { Task } from "@/types/timesheet";

export default function TimesheetDetail() {
  const {
    timesheet,
    taskGroups,
    progressValue,
    totalHours,
    isModalOpen,
    editingTask,
    isSubmitting,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useTimesheetDetail();

  if (!timesheet) {
    return (
      <main className="max-w-[1100px] mx-auto px-3 sm:px-6 pt-6 sm:pt-8 pb-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">Loading timesheet…</p>
        </div>
      </main>
    );
  }

  const dateRange = formatDateRange(timesheet.startDate, timesheet.endDate);

  return (
    <main className="max-w-[1100px] mx-auto px-3 sm:px-6 pt-6 sm:pt-8 pb-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">This week's timesheet</h1>
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{dateRange}</p>
          </div>
          <div className="w-full sm:min-w-[180px] sm:max-w-[220px]">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-[var(--color-text-secondary)]">{totalHours}/40 hrs</span>
              <span className="text-[var(--color-text-secondary)]">{progressValue}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-background)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${progressValue}%`, backgroundColor: "var(--color-primary)" }}
              />
            </div>
          </div>
        </div>

        <div>
          {taskGroups.map((group, groupIndex) => (
            <div key={group.date} className={groupIndex !== 0 ? "border-t border-[var(--color-border)]" : ""}>
              {group.tasks.length === 0 ? (
                <div className="flex items-center px-3 sm:px-6 py-3 border-b border-[var(--color-divider)] gap-2">
                  <div className="w-10 sm:w-14 shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                      {group.label}
                    </span>
                  </div>
                  <span className="flex-1 text-xs sm:text-sm text-[var(--color-text-muted)] italic">No tasks</span>
                </div>
              ) : (
                group.tasks.map((task: Task, taskIndex: number) => (
                  <div
                    key={task.id}
                    className="flex items-center px-3 sm:px-6 py-3 border-b border-[var(--color-divider)] gap-2"
                  >
                    <div className="w-10 sm:w-14 shrink-0">
                      {taskIndex === 0 && (
                        <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                          {group.label}
                        </span>
                      )}
                    </div>

                    <span className="flex-1 text-xs sm:text-sm text-[var(--color-text-primary)] truncate">
                      {task.taskDescription}
                    </span>

                    <span className="shrink-0 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {task.hours} hrs
                    </span>

                    <span className="hidden xs:inline-flex sm:inline-flex shrink-0 items-center px-2 py-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)]">
                      {task.project}
                    </span>

                    <ThreeDotMenu
                      onEdit={() => openEditModal(task)}
                      onDelete={() => handleDelete(task.id)}
                    />
                  </div>
                ))
              )}

              <div className="flex items-center px-3 sm:px-6 py-2 gap-2">
                <div className="w-10 sm:w-14 shrink-0" />
                <button
                  type="button"
                  onClick={() => openAddModal(group.date)}
                  className="flex-1 py-2.5 rounded-lg border border-dashed border-[#BFDBFE] bg-[var(--color-primary-light)] text-xs sm:text-sm font-medium text-[var(--color-primary)] hover:bg-[#DBEAFE] transition-colors"
                >
                  + Add new task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
