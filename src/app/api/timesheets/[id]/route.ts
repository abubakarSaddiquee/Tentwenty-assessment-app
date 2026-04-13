import { NextRequest, NextResponse } from "next/server";
import { deleteTimesheetById, getTimesheetById, updateTimesheetById } from "../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timesheet = getTimesheetById(id);
  if (!timesheet) {
    return NextResponse.json({ message: "Timesheet not found" }, { status: 404 });
  }
  return NextResponse.json(timesheet);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateTimesheetById(id, body);
  if (!updated) {
    return NextResponse.json({ message: "Timesheet not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteTimesheetById(id);
  if (!deleted) {
    return NextResponse.json({ message: "Timesheet not found" }, { status: 404 });
  }
  return NextResponse.json({ message: `Timesheet ${id} deleted` });
}
