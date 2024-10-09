import { Router, Request, Response } from "express";
import booksModel from "../modules/books/books.module";
import { authMiddleware } from "../middlewares/auth.middlewares";
import userModel from "../modules/user/user.module";

interface book {
  title: string;
  num_page: number;
  isbn: string;
  publisher: string;
  author: string;
}
interface bookReturn {
  _id: string;
  title: string;
  num_page: number;
  isbn: string;
  publisher: string;
  author: string;
  createdAt: Date;
  updateAt: Date;
}

const router = Router();

router.post("/books", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const books: book = req.body;

  if (!books.title || !books.isbn || !books.num_page || !books.publisher) {
    res.status(403).json({
      message: `${
        !books.title
          ? "Title"
          : !books.isbn
          ? "isbn"
          : !books.num_page
          ? "num_page"
          : "publisher"
      } is not found`,
    });
    return;
  }

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

router.get("/books", authMiddleware, async (_: Request, res: Response) => {
  try {
    const books = await booksModel
      .find()
      .populate({ path: "author", select: "-books -__v -createdAt -updatedAt" })
      .lean()
      .select("-__v");
    if (!books) {
      res.status(404).json({
        message: "not found",
      });
      return;
    }

    res.status(200).json({ books });
  } catch (err: Error | any) {
    res.status(500).json({
      message: "erro" + err,
    });
  }
});

router.delete(
  "/books/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const bookId = req.params.id;

    const idToken = req.user?._id;

    try {
      const books: bookReturn | any = await booksModel.findById(bookId).lean();
      if (!books) {
        res.status(400).json({
          message: "livro nao encontrado",
        });
        return;
      }

      if (idToken?.toString() !== books.author?.toString()) {
        res.status(404).json({ message: "Not autorized" });
        return;
      }
      // deleta o livro
      const deleteBook = await booksModel.deleteOne(books._id);

      if (deleteBook.deletedCount === 0) {
        res.status(500).json({
          message: "erro ao deletar item",
        });
        return;
      }

      // Remover o ID do livro do campo 'books' no documento do usuário
      const deleteUsersBookId = await userModel.findByIdAndUpdate(
        idToken,
        {
          $pull: { books: bookId },
        },
        {
          new: true,
        }
      );

      console.log(deleteUsersBookId);

      res.status(200).json({ message: "book deletado com sucesso" });
    } catch (err: Error | any) {
      res.status(500).json({
        message: "erro" + err,
      });
    }
  }
);

export default router;
