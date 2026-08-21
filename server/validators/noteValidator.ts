import { body } from "express-validator";

const noteValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("note").notEmpty().withMessage("Note content is required"),
  body("projectId").optional().isMongoId().withMessage("Invalid project ID"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

export { noteValidationRules };
