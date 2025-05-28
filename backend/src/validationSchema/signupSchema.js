const { z } = require('zod');

const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    ),
});
const loginSchema = z.object({
    username: z.string(),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    )
})

const positionSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
    requirements: z.string().optional()
})

module.exports = { 
    signupSchema,
    loginSchema,
    positionSchema
}