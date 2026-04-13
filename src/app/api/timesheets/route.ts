import { NextRequest, NextResponse } from "next/server";
import { addTimesheet, getTimesheets } from "./store";
import type { Timesheet, TimesheetStatus } from "@/types/timesheet";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const allTimesheets = getTimesheets();
  let filtered = [...allTimesheets];

  if (status) {
    filtered = filtered.filter((t) => t.status === (status as TimesheetStatus));
  }

  if (startDate && endDate) {
    filtered = filtered.filter((t) => t.startDate <= endDate && t.endDate >= startDate);
  } else if (startDate) {
    filtered = filtered.filter((t) => t.endDate >= startDate);
  } else if (endDate) {
    filtered = filtered.filter((t) => t.startDate <= endDate);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIdx = (page - 1) * limit;
  const data = filtered.slice(startIdx, startIdx + limit);

  return NextResponse.json({ data, total, page, limit, totalPages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newEntry: Timesheet = {
    id: String(Date.now()),
    weekNumber: 1,
    startDate: body.startDate,
    endDate: body.endDate,
    status: "INCOMPLETE",
    project: body.project,
    typeOfWork: body.typeOfWork,
    taskDescription: body.taskDescription,
    hours: body.hours,
  };

  addTimesheet(newEntry);
  return NextResponse.json(newEntry, { status: 201 });
}
