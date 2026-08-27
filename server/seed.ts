import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model";
import Project from "./models/project.model";
import Note from "./models/note.model";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB for seeding...");

    // 1. Clear existing data (Clean Slate)
    await User.deleteMany({});
    await Project.deleteMany({});
    await Note.deleteMany({});

    // 2. Create a dummy user
    const user = await User.create({
      name: "Amir",
      email: "amir@buildlog.com",
      password: "password123", // Will be automatically hashed by your pre-save hook
    });
    const userId = user._id;

    // 3. Create Projects
    const projects = await Project.insertMany([
      {
        userId,
        name: "OVC1110 Internal System",
        description: "NGO Management Tool",
      },
      { userId, name: "DevNotes API Reframe", description: "Build Log Tool" },
      {
        userId,
        name: "Quran Literacy Platform",
        description: "Tutoring Business",
      },
    ]);

    const [ovcProject, devNotesProject, quranProject] = projects;

    // Helper to generate dates in the past
    const daysAgo = (days: number) =>
      new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 4. Create Notes (Dates manipulated to test the streak logic)
    await Note.insertMany([
      {
        userId,
        projectId: ovcProject._id,
        content:
          "Prisma db push wiped my staging data. Need to write actual migration scripts next time instead of relying on push.",
        tags: ["prisma", "database", "mistake"],
        createdAt: daysAgo(0), // Today
      },
      {
        userId,
        projectId: ovcProject._id,
        content:
          "JWT sandbox saved me. Found the staff.email typo before it hit production.",
        tags: ["auth", "jwt", "testing"],
        createdAt: daysAgo(1), // Yesterday
      },
      {
        userId,
        projectId: devNotesProject._id,
        content:
          "Reframed the whole app. Notes are useless, Build Logs are valuable. Changed schema to require projectId.",
        tags: ["architecture", "reframe", "schema"],
        createdAt: daysAgo(2), // 2 days ago
      },
      {
        userId,
        projectId: devNotesProject._id,
        content:
          "Mongo $unwind is the only way to count array items in aggregation. Factory assembly line mental model makes sense now.",
        tags: ["mongodb", "aggregation"],
        createdAt: daysAgo(3), // 3 days ago (Streak is now 4 days: 0, 1, 2, 3)
      },
      {
        userId,
        projectId: devNotesProject._id,
        content:
          "Skipped Postman testing on Day 4. Bad idea. Wasted time debugging later. Always test endpoints before building the next layer.",
        tags: ["process", "mistake"],
        createdAt: daysAgo(5), // 5 days ago (Breaks the streak)
      },
      {
        userId,
        projectId: quranProject._id,
        content:
          "Setup Fajr routine as the anchor for daily coding sessions. Deep work happens here before the Lagos heat kicks in.",
        tags: ["productivity", "personal"],
        createdAt: daysAgo(10), // 10 days ago
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log(
      "🔑 Login Credentials -> email: amir@buildlog.com | password: password123",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
