import Project from "../models/project.model";
import Note from "../models/note.model";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Please add a project name" });
  }
  const projectExists = await Project.findOne({ name });
  if (projectExists) {
    return res.status(400).json({ message: "Project already exists" });
  }

  const project = await Project.create({
    userId: req.user?._id,
    name,
    description,
  });

  return res.status(201).json({ project, message: "Project created" });
};

// ===========================================================

export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.find({ userId: req.user?._id })
    .sort({
      createdAt: -1,
    })
    .lean();

  if (projects.length === 0) return res.status(200).json([]);

  const projectIds = projects.map((p) => p._id);

  // Aggregate note counts and collect all tags per project
  const noteStats = await Note.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: "$projectId",
        count: { $sum: 1 },
        tags: { $push: "$tags" },
      },
    },
  ]);

  const statsMap = new Map(noteStats.map((s) => [s._id.toString(), s]));

  const enrichedProjects = projects.map((p) => {
    const stats = statsMap.get(p._id.toString()) || { count: 0, tags: [] };
    // Flatten the array of arrays of tags, then count frequencies
    const flatTags = (stats.tag || []).flat();
    const tagCounts: Record<string, number> = {};
    flatTags.forEach((t: string) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });

    // Get top 3 most used tags for this project
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((t) => t[0]);

    return {
      ...p,
      entryCount: stats.count,
      topTags,
    };
  });
  return res.status(200).json(enrichedProjects);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  });
  if (!project) {
    return res.status(404).json({ message: "Project not Found" });
  }
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;

  const updated = await project.save();
  return res.status(200).json(updated);
};

export const deleteProject = async (req: Request, res: Response) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  await Note.deleteMany({ projectId: project._id });
  await project.deleteOne();
  return res
    .status(200)
    .json({ message: "Projects and associated notes deleted" });
};
