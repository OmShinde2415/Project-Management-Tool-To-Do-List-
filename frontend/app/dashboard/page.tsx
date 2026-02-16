"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { Project } from "../../types";
import ProjectCard from "../../components/ProjectCard";

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      void fetchProjects();
    }
  }, [authLoading]);

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", { title, description });
      setTitle("");
      setDescription("");
      await fetchProjects();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete project");
    }
  };

  if (authLoading) {
    return <p className="text-sm text-slate-600">Checking authentication...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-600">Welcome {user?.name}</p>
      </div>

      <form onSubmit={handleCreateProject} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Create Project</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="rounded border border-slate-300 px-3 py-2"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <button className="mt-3 rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          Create Project
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-600">Loading projects...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              canDelete={project.owner?._id === user?._id}
              onDelete={handleDeleteProject}
            />
          ))}
          {!projects.length && <p className="text-sm text-slate-600">No projects found.</p>}
        </div>
      )}
    </section>
  );
}
