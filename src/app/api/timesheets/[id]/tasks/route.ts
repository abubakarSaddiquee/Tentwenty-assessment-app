import { NextRequest, NextResponse } from "next/server";
import { getTasksByTimesheetId, addTask } from "../../tasks-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tasks = getTasksByTimesheetId(id);
  return NextResponse.json(tasks);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const task = addTask({
    id: String(Date.now()),
    timesheetId: id,
    date: body.date,
    project: body.project,
    typeOfWork: body.typeOfWork,
    taskDescription: body.taskDescription,
    hours: body.hours,
  });

  return NextResponse.json(task, { status: 201 });
}
