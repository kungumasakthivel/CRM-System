const Joi = require('joi');


const userSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "any.required": "User ID is required",
  }),
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must contain only numbers",
      "any.required": "Phone is required",
    }),
  company: Joi.string().optional().default("Not Provided")
});


const userData = {
  name: "John Doe",
  email: "john.doeexample.com",
  phone: "1234567890",
  company: "Example Inc.",
};

const { error, value } = userSchema.validate(userData);

if (error) {
  console.log("Validation failed:", error.details.map((err) => err.message));
} else {
  console.log("Validation successful:", value);
}

module.exports = userSchema