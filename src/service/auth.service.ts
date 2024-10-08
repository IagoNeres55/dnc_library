import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.KEY_JWT as string;

if (!JWT_SECRET) {
  throw new Error("not exist key");
}

function generateToken(user: string): string {
  const id: string = user;
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

export default generateToken;
