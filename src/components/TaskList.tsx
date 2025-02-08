"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "@/redux/taskSlice";
import { RootState, AppDispatch } from "@/redux/store";
import TaskForm from "./TaskForm";

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.task);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-gray-700">
      <h2 className="text-xl font-semibold mb-2">Task List</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="border-b p-2 flex justify-between items-center">
            {editingTask === task._id ? (
              <TaskForm existingTask={task} onCancel={() => setEditingTask(null)} />
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="space-x-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => setEditingTask(task._id)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => dispatch(deleteTask(task._id))}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
