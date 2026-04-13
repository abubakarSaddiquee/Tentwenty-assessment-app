export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const monthName = start.toLocaleString("en-US", { month: "long" });
  const year = start.getFullYear();
  return `${start.getDate()} - ${end.getDate()} ${monthName}, ${year}`;
}

export function formatSingleDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
