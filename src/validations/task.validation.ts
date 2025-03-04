//! src/validations/task.validation.ts

import Joi from "joi";

/**
 * Schema for validating task creation requests.
 * Ensures that required fields are present and valid.
 */
export const createTaskSchema = Joi.object({
  title: Joi.string().min(8).max(50).required().messages({
    "string.base": "The title must be a text.",
    "string.empty": "The title cannot be empty.",
    "string.min": "The title must be at least 8 characters long.",
    "string.max": "The title must be at most 50 characters long.",
    "any.required": "The title is required.",
  }),

  // Validation for the description field
  description: Joi.string().min(16).max(200).optional().messages({
    "string.base": "The description must be a text.",
    "string.empty": "The description cannot be empty.",
    "string.min": "The description must be at least 16 characters long.",
    "string.max": "The description cannot exceed 200 characters.",
  }),

  completed: Joi.boolean().optional().default(false),

  dueDate: Joi.date().required().messages({
    "date.base": "The due date must be a valid date.",
    "any.required": "The due date is required.",
  }),
});

/**
 * Schema for validating task update requests.
 * Allows updating one or more fields; at least one field must be provided.
 */
export const updateTaskSchema = Joi.object({
  title: Joi.string().min(8).max(50).optional().messages({
    "string.base": "The title must be a text.",
    "string.empty": "The title cannot be empty.",
    "string.min": "The title must be at least 8 characters long.",
    "string.max": "The title must be at most 50 characters long.",
  }),

  // Validation for the description field
  description: Joi.string().min(16).max(200).optional().messages({
    "string.base": "The description must be a text.",
    "string.empty": "The description cannot be empty.",
    "string.max": "The description cannot exceed 200 characters.",
  }),

  completed: Joi.boolean().optional(),

  dueDate: Joi.date().optional().messages({
    "date.base": "The due date must be a valid date.",
  }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update the task.",
  });
