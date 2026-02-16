import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
