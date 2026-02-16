import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}

const statuses: Task["status"][] = ["todo", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h4 className="font-medium text-slate-900">{task.title}</h4>
      <p className="mt-1 text-sm text-slate-600">{task.description || "No description"}</p>
      <p className="mt-2 text-xs text-slate-500">
        Assigned: {task.assignedTo?.name || "Unassigned"}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value as Task["status"])}
          className="rounded border border-slate-300 px-2 py-1 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => onDelete(task._id)}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
