import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProject extends Document {
  userId: Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: {
      type: String,
      required: [true, "Please add a project name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, "Description cannot be more than 200 characters"],
    },
  },
  { timestamps: true },
);

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema,
);

export default Project;
