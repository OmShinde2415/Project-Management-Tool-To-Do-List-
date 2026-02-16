import mongoose, { Document, Schema, Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  project: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
