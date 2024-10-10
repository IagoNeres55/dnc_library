import { Router, Request, Response } from "express";

import userModel from "../modules/user/user.module";
import { loginSchema, payload_login } from "../schema/user.schema";
import { validade } from "../middlewares/validation.middlewares";
import { userSchema } from "../schema/user.schema";
import bcrypt from "bcryptjs";
import generateToken from "../service/auth.service";
import { authMiddleware } from "../middlewares/auth.middlewares";

export interface User {
  _id: String;
  email: String;
  password: String;
  createdAt: Date;
  updatedAt: Date;
  books: string[];
  __v: Number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const router = Router();

// login
router.post(
  "/login",
  validade(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const lowCaseEmail = email.toLowerCase();
    if (!email || !password) {
      res.status(403).json({
        message: "erro informe as credenciais",
      });
      return;
    }

    try {
      const user = (await userModel.findOne({ email: lowCaseEmail })) as User;
      if (!user?.password) {
        res.status(400).json({ message: "user not exists" });
        return;
      }
      const userSenha = bcrypt.compareSync(password, user?.password as string);
      if (!userSenha) {
        res.status(400).json({ message: "Senha ou email estão incorretos" });
        return;
      }

      res.status(200).json({
        message: "Sucesso!",
        token: generateToken(user._id as string),
        expiresIn: 86400,
      });
    } catch (err) {
      res.status(500).json({ message: "Error creating user", err });
      return;
    }
  }
);
// criar usuario
router.post(
  "/user",
  validade(userSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(403).json({
        message: `${
          !name ? "Name" : !email ? "Email" : "Password"
        } is not found!`,
      });
      return;
    }
    const lowCaseEmail = email.toLowerCase();
    try {
      const validaEmail = await userModel.findOne({ email: lowCaseEmail });
      //valida se o email cadastrado já esta em uso

      if (validaEmail) {
        res.status(400).json({ message: "email already used!" });
        return;
      }
      // faz a criptografia da senha
      const passHash: string = bcrypt.hashSync(password, 10);
      const newUser: payload_login = {
        name: name,
        email: lowCaseEmail,
        password: passHash,
      };

      // insere os dados no banco
      const user = await userModel.create(newUser);
      res.status(201).json({
        message: "User created!",
        id: user._id,
        createdAt: user.createdAt,
      });
    } catch (err: Error | any) {
      res.status(500).json({ message: "Error creating user", err });
      return;
    }
  }
);

router.get("/users", authMiddleware, async (req: Request, res: Response) => {
  // const user = req.user;

  try {
    const users = await userModel.find().lean().select("-password -__v");
    res.status(200).json({ users });
  } catch (err: Error | any) {
    res.status(400).json({ message: err.message });
  }
});

router.get(
  "/users/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      // populate tras os dados que estao vinculados por id
      // posso passar argumentos dentro do populate(
      // path: "books",
      // select: "title isbn publishedDate",)
      const user = await userModel
        .findById(userId)
        .populate({
          path: "books",
          select: "-author -__v",
        })
        .select("-password -__v");

      if (!user) {
        res.status(404).json({
          message: "user not found",
        });
        return;
      }
      res.status(200).json(user);
    } catch (err: Error | any) {
      res.status(500).json({ message: "Error fetching user", err });
    }
  }
);

export default router;
