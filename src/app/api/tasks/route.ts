import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// Get all tasks
export async function GET() {
  await connectDB();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

// Create a new task
export async function POST(req: Request) {
  await connectDB();
  const { title, description } = await req.json();
  const newTask = new Task({ title, description, completed: false });
  await newTask.save();
  return NextResponse.json(newTask, { status: 201 });
}

// Delete a task by ID
export async function DELETE(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}

// Update a task by ID (PATCH)
export async function PATCH(req: Request) {
  await connectDB();
  const { id, title, description, completed } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true }
  );

  if (!updatedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
}
