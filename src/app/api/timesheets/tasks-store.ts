import { getTimesheets } from "./store";

export interface Task {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __taskStore: { tasks: Task[] } | undefined;
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
  "Reviewed pull requests",
  "Performance optimisations",
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmt(date: Date) {
  return date.toISOString().split("T")[0];
}

function generateTasks(): Task[] {
  const timesheets = getTimesheets();
  const tasks: Task[] = [];
  let taskId = 1;

  for (const ts of timesheets) {
    if (ts.status === "MISSING") continue;
    const start = new Date(ts.startDate);
    const counts = [2, 3, 2, 2, 2];

    for (let day = 0; day < 5; day++) {
      const date = fmt(addDays(start, day));
      for (let t = 0; t < counts[day]; t++) {
        tasks.push({
          id: String(taskId),
          timesheetId: ts.id,
          date,
          project: PROJECTS[taskId % PROJECTS.length],
          typeOfWork: WORK_TYPES[taskId % WORK_TYPES.length],
          taskDescription: DESCRIPTIONS[taskId % DESCRIPTIONS.length],
          hours: 4,
        });
        taskId++;
      }
    }
  }

  return tasks;
}

function ensureStore() {
  if (!globalThis.__taskStore) {
    globalThis.__taskStore = { tasks: generateTasks() };
  }
  return globalThis.__taskStore;
}

export function getTasksByTimesheetId(timesheetId: string): Task[] {
  return ensureStore().tasks.filter((t) => t.timesheetId === timesheetId);
}

export function addTask(task: Task): Task {
  ensureStore().tasks.push(task);
  return task;
}

export function updateTaskById(id: string, body: Partial<Task>): Task | null {
  const store = ensureStore();
  const index = store.tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  store.tasks[index] = { ...store.tasks[index], ...body };
  return store.tasks[index];
}

export function deleteTaskById(id: string): boolean {
  const store = ensureStore();
  const before = store.tasks.length;
  store.tasks = store.tasks.filter((t) => t.id !== id);
  return store.tasks.length < before;
}
