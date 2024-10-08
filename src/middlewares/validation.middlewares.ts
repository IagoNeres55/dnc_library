import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validade =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({ error: err.errors });
    }
  };

export { validade };
