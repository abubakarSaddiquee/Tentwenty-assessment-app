import type { Timesheet, TimesheetStatus } from "@/types/timesheet";

declare global {
  // eslint-disable-next-line no-var
  var __timesheetStore: { timesheets: Timesheet[] } | undefined;
}

const PROJECTS = [
  "Homepage Development",
  "Dashboard Redesign",
  "Mobile App",
  "API Integration",
];
const WORK_TYPES = ["Development", "Design", "Bug fixes", "Code Review", "Meeting"];
const DESCRIPTIONS = [
  "Built homepage layout",
  "Redesigned dashboard UI",
  "Mobile navigation components",
  "REST API endpoints",
  "Fixed responsive issues",
  "Chart components",
  "UI polish and refinements",
  "Reviewed pull requests",
  "Performance optimisations",
  "Database schema updates",
];
const STATUSES: TimesheetStatus[] = ["COMPLETED", "INCOMPLETE", "MISSING"];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function fmt(date: Date) {
  return date.toISOString().split("T")[0];
}

function generateTimesheets(): Timesheet[] {
  const result: Timesheet[] = [];
  let start = new Date("2024-01-01");

  for (let i = 1; i <= 15; i++) {
    const end = addDays(start, 4);
    const status = STATUSES[i % 3] as TimesheetStatus;
    const isMissing = status === "MISSING";

    result.push({
      id: String(i),
      weekNumber: i,
      startDate: fmt(start),
      endDate: fmt(end),
      status,
      project: isMissing ? "" : PROJECTS[i % PROJECTS.length],
      typeOfWork: isMissing ? "" : WORK_TYPES[i % WORK_TYPES.length],
      taskDescription: isMissing ? "" : DESCRIPTIONS[i % DESCRIPTIONS.length],
      hours: isMissing ? 0 : 40,
    });

    start = addDays(start, 7);
  }

  return result;
}

function ensureStore() {
  if (!globalThis.__timesheetStore) {
    globalThis.__timesheetStore = {
      timesheets: generateTimesheets(),
    };
  }
  return globalThis.__timesheetStore;
}

export function getTimesheets() {
  return ensureStore().timesheets;
}

export function getTimesheetById(id: string) {
  return getTimesheets().find((timesheet) => timesheet.id === id) ?? null;
}

export function addTimesheet(entry: Timesheet) {
  const store = ensureStore();
  store.timesheets.forEach((t) => { t.weekNumber += 1; });
  store.timesheets.unshift(entry);
  return entry;
}

export function updateTimesheetById(id: string, body: Partial<Timesheet>) {
  const store = ensureStore();
  const index = store.timesheets.findIndex((timesheet) => timesheet.id === id);
  if (index === -1) return null;

  const existing = store.timesheets[index];
  const updated = {
    ...existing,
    ...body,
  };

  store.timesheets[index] = updated;
  return updated;
}

export function deleteTimesheetById(id: string) {
  const store = ensureStore();
  const originalLength = store.timesheets.length;
  store.timesheets = store.timesheets.filter((timesheet) => timesheet.id !== id);
  return store.timesheets.length < originalLength;
}
