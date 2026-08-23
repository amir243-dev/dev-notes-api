import mongoose from "mongoose";
import Note from "../models/note.model";
import Project from "../models/project.model";
import { Request, Response } from "express";
import mongooose from "mongoose";

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
  if (tag) filter.tags = { $in: [tag] };
  if (search) filter.content = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const notes = await Note.find(filter)
    .sort({ createdAt: sort === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("projectId", "name");

  const count = await Note.countDocuments(filter);
  return res.status(200).json({
    notes,
    totalPages: Math.ceil(count / Number(limit)),
    currentPage: Number(page),
    totalNotes: count,
  });
};

// ======================================================================

export const getNoteById = async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  }).populate("projectId", "name");
  if (!note) return res.status(404).json({ message: "Note not found" });
  return res.status(200).json(note);
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

// ===========================================================================

export const getStats = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }
  // 1. Total Notes (Simple count, no need for aggregation)
  const totalNotes = await Note.countDocuments({ userId });

  // 2. Notes per Project (Aggregation)
  const notesPerProject = await Note.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
    { $group: { _id: "$projectId", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "_id",
        as: "projectInfo",
      },
    },
    { $unwind: { path: "$projectInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        projectId: "$_id",
        projectName: { $ifNull: ["$projectInfo.name", "Unknown"] },
        count: 1,
      },
    },
  ]);

  // 3. Most Used Tags (Aggregation)
  const mostUsedTags = await Note.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
    { $unwind: "$tags" }, // Unpacks the array so we can count individual tags
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // 4 & 5. Weekly Count & Streak (JS Logic)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  // Fetch last 30 days of notes. .lean() strips Mongoose overhead, returning plain JS objects.
  const recentNotes = await Note.find({
    userId,
    createdAt: { $gte: thirtyDaysAgo },
  })
    .select("createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyCount = recentNotes.filter(
    (n) => new Date(n.createdAt) >= sevenDaysAgo,
  ).length;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create a Set of unique midnight timestamps for O(1) lookups
  const uniqueDates = new Set(
    recentNotes.map((n) => {
      const d = new Date(n.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );

  let checkDate = new Date(today);
  // If no notes today, start checking from yesterday
  if (!uniqueDates.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (uniqueDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return res.status(200).json({
    totalNotes,
    notesPerProject,
    mostUsedTags,
    weeklyCount,
    streak,
  });
};
