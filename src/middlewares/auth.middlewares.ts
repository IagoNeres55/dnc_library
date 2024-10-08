import jwt, { VerifyErrors } from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import userModel from "../modules/user/user.module";

const JWT_SECRET = process.env.KEY_JWT as string;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenHeaders = req.headers.authorization;

  if (tokenHeaders) {
    res.status(401).json({ message: "token not informat!" });
    return;
  }

  const divideToken = tokenHeaders?.split(" ") as string[];
  if (divideToken?.length !== 2) {
    res.status(401).json({ message: "token invalido" });
  }

  const [bearer, token]: string[] = divideToken;

  if (!/^Bearer$/i.test(bearer)) {
    return res.status(401).send({ message: "Token fora do formato Bearer" });
  }

  jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "token invalida" });
    }

    if (!decoded) return;
    const user = await userModel.findById(decoded.id);
    if (!user || !user._id) {
      res.status(401).send({ message: "token invalido" });
    }
    return next();
  });
}
