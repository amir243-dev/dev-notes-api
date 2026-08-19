import Note from "../models/note.model";
import Project from "../models/project.model";
import { Request, Response } from "express";

export const createNote = async (req: Request, res: Response) => {
  const { content, projectId, tags } = req.body;
  if (!content || !projectId) {
    return res
      .status(400)
      .json({ message: "Please add content and select a project" });
  }
  // Verify project belongs to user (Data Isolation)
  const project = await Project.findOne({
    _id: projectId,
    userId: req.user?._id,
  });
  if (!project) {
    return res
      .status(404)
      .json({ message: "Project not Found or access denied" });
  }

  const note = await Note.create({
    userId: req.user?._id,
    projectId,
    content,
    tags: tags || [],
  });
  res.status(201).json(note);
};

// ===============================================================

export const getNotes = async (req: Request, res: Response) => {
  const { projectId, tag, search, sort, page = 1, limit = 10 } = req.query;
  const filter: any = { userId: req.user?._id };

  if (projectId) filter.projectId = projectId;
  if (tag) filter.tag = { $in: [tag] };
  if (search) filter.search = { $regex: search, $options: "i" };

  const skip = Number(page) - 1 * Number(limit);

  const notes = Note.find(filter)
    .sort({ createdAt: sort === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("projectId", "name");

  const count = await notes.countDocuments(filter);
  return res.status(200).json({
    notes,
    totalPages: Math.ceil(count / Number(limit)),
    currentPage: Number(page),
    totalNotes: count,
  });
};

// ======================================================================

export const updateNote = async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  });
  if (!note) {
    return res.status(404).json({ message: "Note not Found" });
  }

  const { content, tags, projectId } = req.body;
  if (projectId && projectId.toString() !== note.projectId.toString()) {
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user?._id,
    });
    if (!project)
      return res.status(404).json({ message: "Target project not found" });
    note.projectId = projectId;
  }
  note.content = content || note.content;
  note.tags = tags || note.tags;

  const updatedNote = await note.save();
  return res.status(200).json(updatedNote);
};

// ====================================================================

export const deleteNote = async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  });
  if (!note) return res.status(404).json({ message: "Note not found" });

  await note.deleteOne();
  return res.status(200).json({ message: "Note removed" });
};
