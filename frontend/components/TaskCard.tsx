"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Task, TaskStatus } from "../types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/task/${task._id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post("/comments", {
        content: newComment,
        taskId: task._id,
      });

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
      {/* Task Info */}
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>

      {/* Status Controls */}
      <div className="flex gap-2 mb-3">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value as TaskStatus)
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-3">
        <h4 className="font-medium text-sm mb-2">Comments</h4>

        <div className="space-y-2 mb-3">
          {comments.length === 0 && (
            <p className="text-xs text-gray-400">No comments yet</p>
          )}

          {comments.map((comment) => (
            <div
              key={comment._id}
              className="text-xs bg-gray-100 p-2 rounded"
            >
              <strong>{comment.author?.name || "User"}:</strong>{" "}
              {comment.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}