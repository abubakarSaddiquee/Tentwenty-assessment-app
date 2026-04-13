import { NextRequest, NextResponse } from "next/server";
import { updateTaskById, deleteTaskById } from "../../../tasks-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { taskId } = await params;
  const body = await request.json();

  const updated = updateTaskById(taskId, body);
  if (!updated) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { taskId } = await params;

  const deleted = deleteTaskById(taskId);
  if (!deleted) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ message: `Task ${taskId} deleted` });
}
