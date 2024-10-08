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

    if (!email || !password) {
      res.status(403).json({
        message: "erro informe as credenciais",
      });
    }

    try {
      const user = (await userModel.findOne({ email })) as User;
      if (!user?.password) {
        res.status(400).json({ message: "user not exists" });
        return;
      }
      const userSenha = bcrypt.compareSync(password, user?.password as string);
      if (!userSenha) {
        res.status(400).json({ message: "Senha ou email estão incorretos" });
        return;
      }

      if (userSenha) {
        res.status(200).json({
          message: "Sucesso!",
          token: generateToken(user._id as string),
          expiresIn: 86400,
        });
      }
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

    try {
      //abre conexão com banco
      //valida se o email cadastrado já esta em uso
      const validaEmail = await userModel.findOne({ email });
      if (validaEmail) {
        res.status(400).json({ message: "email already used!" });
        return;
      }
      // faz a criptografia da senha
      const passHash: string = bcrypt.hashSync(password, 10);
      const newUser: payload_login = {
        name: req.body.name,
        email: req.body.email,
        password: passHash,
      };

      // insere os dados no banco
      const user = await userModel.create(newUser);
      res.status(201).json({
        message: "User created!",
        id: user._id,
        createdAt: user.createdAt,
      });
    } catch (err) {
      console.log("erro", err);
      res.status(500).json({ message: "Error creating user", err });
      return;
    }
  }
);

router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json(user);
});

export default router;
