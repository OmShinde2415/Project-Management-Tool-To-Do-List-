"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { socket } from "../../../lib/socket";
import { useRequireAuth } from "../../../lib/useRequireAuth";
import { Task, TaskStatus } from "../../../types";
import TaskCard from "../../../components/TaskCard";

const statuses: TaskStatus[] = ["todo", "in-progress", "done"];

export default function ProjectDetailsPage() {
  const { loading: authLoading } = useRequireAuth();
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && projectId) {
      void fetchTasks();
    }
  }, [authLoading, projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    socket.connect();
    socket.emit("project:join", projectId);

    const refetch = () => {
      void fetchTasks();
    };

    socket.on("task:created", refetch);
    socket.on("task:updated", refetch);

    return () => {
      socket.emit("project:leave", projectId);
      socket.off("task:created", refetch);
      socket.off("task:updated", refetch);
      socket.disconnect();
    };
  }, [projectId]);

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done")
    };
  }, [tasks]);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/tasks", {
        title,
        description,
        project: projectId,
        assignedTo: assignedTo || undefined
      });
      setTitle("");
      setDescription("");
      setAssignedTo("");
      await fetchTasks();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete task");
    }
  };

  if (authLoading) {
    return <p className="text-sm text-slate-600">Checking authentication...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Project Tasks</h1>
        <p className="text-sm text-slate-600">Project ID: {projectId}</p>
      </div>

      <form onSubmit={handleCreateTask} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Create Task</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="rounded border border-slate-300 px-3 py-2"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded border border-slate-300 px-3 py-2"
          />
          <input
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Assign to userId (optional)"
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <button className="mt-3 rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          Create Task
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-600">Loading tasks...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {statuses.map((status) => (
            <div key={status} className="rounded-lg border border-slate-200 bg-slate-100 p-3">
              <h3 className="mb-3 font-semibold capitalize">{status}</h3>
              <div className="space-y-3">
                {groupedTasks[status].map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                  />
                ))}
                {!groupedTasks[status].length && (
                  <p className="text-xs text-slate-500">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
