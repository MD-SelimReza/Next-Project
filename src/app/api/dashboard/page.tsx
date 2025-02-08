import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  return (
    <div>
      <div className="max-w-2xl mx-auto mt-4">
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
}
