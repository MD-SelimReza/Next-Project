import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// Delete Task (DELETE)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}

// Update Task (PATCH)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params; // ✅ Correct way to get the ID
    const { title, description, completed } = await req.json();
  
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
  
  