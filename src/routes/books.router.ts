import { Router, Request, Response } from "express";
import booksModel from "../modules/user/books.module";
import { authMiddleware } from "../middlewares/auth.middlewares";
import userModel from "../modules/user/user.module";

const router = Router();

router.post("/books", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const books = req.body;

  try {
    const booksCreate = await booksModel.create({
      title: books.title,
      num_page: books.num_page,
      isbn: books.isbn,
      publisher: books.publisher,
      author: userId,
    });

    // faz o update na coluna books com o livro criado
    await userModel.findByIdAndUpdate(userId, {
      $push: { books: booksCreate._id },
    });

    res.status(201).json({
      message: "book Created",
      booksCreate,
    });
  } catch (err: Error | any) {
    res.status(500).json({ message: "Error creating user", err });
    return;
  }
});

export default router;
