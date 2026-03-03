const { body } = require("express-validator");

const noteValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title is too long broski"),

  body("note")
    .isLength({ min: 10 })
    .withMessage("Note must at least 10 characters long"),
];

module.exports = { noteValidationRules };
