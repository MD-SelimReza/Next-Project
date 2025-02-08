"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "@/redux/taskSlice";
import { AppDispatch } from "@/redux/store";

interface Task {
  _id?: string;
  title: string;
  description: string;
}

interface Props {
  existingTask?: Task;
  onCancel?: () => void;
}

export default function TaskForm({ existingTask, onCancel }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [task, setTask] = useState<Task>(
    existingTask || { _id: "", title: "", description: "" } // ✅ Ensures _id is never undefined
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title.trim()) {
      alert("Task title is required!");
      return;
    }

    try {
      if (task._id) {
        // ✅ Fix: Type assertion to ensure _id is treated as a string
        await dispatch(updateTask(task as Required<Task>));
      } else {
        await dispatch(addTask(task));
      }

      if (!existingTask) setTask({ _id: "", title: "", description: "" });

      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-gray-700">
      <h2 className="text-xl font-semibold mb-2">{existingTask ? "Edit Task" : "Add Task"}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {existingTask ? "Update" : "Add Task"}
          </button>
          {existingTask && (
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
