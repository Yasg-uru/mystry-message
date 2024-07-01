import { z } from "zod";
export const usernamevalidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(10, "username must be atmost 10 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");

export const signUpSchema = z.object({
  username: usernamevalidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {message:"password must be atleast 6 characters"}),
});
