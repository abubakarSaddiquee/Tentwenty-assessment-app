export const PROJECT_OPTIONS = [
  { value: "homepage", label: "Homepage Development" },
  { value: "dashboard", label: "Dashboard Redesign" },
  { value: "mobile", label: "Mobile App" },
  { value: "api", label: "API Integration" },
];

export const TYPE_OF_WORK_OPTIONS = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "bug_fix", label: "Bug fixes" },
  { value: "review", label: "Code Review" },
  { value: "meeting", label: "Meeting" },
];

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
