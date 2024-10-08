import jwt, { VerifyErrors } from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import userModel from "../modules/user/user.module";
import { User } from "../routes/user.router";

const JWT_SECRET = process.env.KEY_JWT as string;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const tokenHeaders = req.headers.authorization;

  if (!tokenHeaders) {
    res.status(401).json({ message: "token not informat!" });
    return;
  }

  const divideToken = tokenHeaders?.split(" ") as string[];
  if (divideToken?.length !== 2) {
    res.status(401).json({ message: "token invalido" });
    return;
  }

  const [bearer, token]: string[] = divideToken;

  if (!/^Bearer$/i.test(bearer)) {
    res.status(401).send({ message: "Token fora do formato Bearer" });
    return;
  }

  jwt.verify(
    token,
    JWT_SECRET,
    async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(401).json({ message: "Invalid token!" });
        return;
      }

      if (!decoded || !decoded.id) {
        res.status(401).json({ message: "Invalid token payload!" });
        return;
      }
      const user = await userModel
        .findById(decoded.id)
        .lean()
        .select("-password");

      if (!user || !user._id) {
        res.status(401).send({ message: "token invalido" });
        return;
      }
      req.user = user as User | any;
      next();
    }
  );
}
