import { z } from "zod";


export interface payload_login {
  name: string;
  email: string;
  password: string;
}

const userSchema = z.object({
  name: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export { userSchema, loginSchema };
