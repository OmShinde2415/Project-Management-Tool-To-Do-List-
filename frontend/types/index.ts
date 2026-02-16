export type TaskStatus = "todo" | "in-progress" | "done";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  owner: User;
  members: User[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: string;
  assignedTo?: User;
  createdAt: string;
}
