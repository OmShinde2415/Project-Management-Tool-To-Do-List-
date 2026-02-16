import Link from "next/link";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
  canDelete: boolean;
}

export default function ProjectCard({ project, onDelete, canDelete }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{project.description || "No description"}</p>
      <p className="mt-2 text-xs text-slate-500">Members: {project.members?.length || 0}</p>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/projects/${project._id}`}
          className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
        >
          Open
        </Link>
        {canDelete && (
          <button
            onClick={() => onDelete(project._id)}
            className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
