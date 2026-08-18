import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INote extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, required: true, ref: "Project" },
    content: { type: String, required: [true, "Please add note content"] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

const Note: Model<INote> = mongoose.model<INote>("Note", noteSchema);
export default Note;
