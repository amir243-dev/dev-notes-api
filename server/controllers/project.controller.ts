import Project from "../models/project.model";
import Note from "../models/note.model";
import { Request, Response } from "express";

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
  const projects = await Project.find({ userId: req.user?._id }).sort({
    createdAt: -1,
  });
  return res.status(200).json(projects);
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
