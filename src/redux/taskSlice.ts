import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed?: boolean;
}

interface TaskState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TaskState = {
  tasks: [],
  status: "idle",
};

// Fetch tasks
export const fetchTasks = createAsyncThunk<Task[]>("task/fetchTasks", async () => {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
});

// Add task
export const addTask = createAsyncThunk<Task, Omit<Task, "_id">>(
  "task/addTask",
  async (task, { dispatch }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to add task");
    const newTask = await res.json();
    dispatch(fetchTasks()); // Refresh tasks after adding
    return newTask;
  }
);

// Delete task
export const deleteTask = createAsyncThunk<string, string>(
  "task/deleteTask",
  async (id, { dispatch }) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    dispatch(fetchTasks()); // Refresh tasks after deleting
    return id;
  }
);

// Update task
export const updateTask = createAsyncThunk<Task, Task>(
  "task/updateTask",
  async (task, { dispatch }) => {
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to update task");
    const updatedTask = await res.json();
    dispatch(fetchTasks()); // Refresh tasks after updating
    return updatedTask;
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
