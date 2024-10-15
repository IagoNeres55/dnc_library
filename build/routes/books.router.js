"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_module_1 = __importDefault(require("../modules/books/books.module"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const user_module_1 = __importDefault(require("../modules/user/user.module"));
const router = (0, express_1.Router)();
router.post("/books", auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const books = req.body;
    if (!books.title || !books.isbn || !books.num_page || !books.publisher) {
        res.status(403).json({
            message: `${!books.title
                ? "Title"
                : !books.isbn
                    ? "isbn"
                    : !books.num_page
                        ? "num_page"
                        : "publisher"} is not found`,
        });
        return;
    }
    try {
        const booksCreate = yield books_module_1.default.create({
            title: books.title,
            num_page: books.num_page,
            isbn: books.isbn,
            publisher: books.publisher,
            author: userId,
        });
        // faz o update na coluna books com o livro criado
        yield user_module_1.default.findByIdAndUpdate(userId, {
            $push: { books: booksCreate._id },
        });
        res.status(201).json({
            message: "book Created",
            booksCreate,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating user", err });
        return;
    }
}));
router.get("/books", auth_middlewares_1.authMiddleware, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield books_module_1.default
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
    }
    catch (err) {
        res.status(500).json({
            message: "erro" + err,
        });
    }
}));
router.delete("/books/:id", auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const bookId = req.params.id;
    const idToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const books = yield books_module_1.default.findById(bookId).lean();
        if (!books) {
            res.status(400).json({
                message: "livro nao encontrado",
            });
            return;
        }
        if ((idToken === null || idToken === void 0 ? void 0 : idToken.toString()) !== ((_b = books.author) === null || _b === void 0 ? void 0 : _b.toString())) {
            res.status(404).json({ message: "Not autorized" });
            return;
        }
        // deleta o livro
        const deleteBook = yield books_module_1.default.deleteOne(books._id);
        if (deleteBook.deletedCount === 0) {
            res.status(500).json({
                message: "erro ao deletar item",
            });
            return;
        }
        // Remover o ID do livro do campo 'books' no documento do usuário
        const deleteUsersBookId = yield user_module_1.default.findByIdAndUpdate(idToken, {
            $pull: { books: bookId },
        }, {
            new: true,
        });
        if (!deleteUsersBookId) {
            res.status(500).json({
                message: "erro ao buscar id em users [book]",
            });
            return;
        }
        res.status(200).json({ message: "book deletado com sucesso" });
    }
    catch (err) {
        res.status(500).json({
            message: "erro" + err,
        });
    }
}));
router.put("/books/:id", auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const book = req.body;
    const validFields = ["title", "num_page", "isbn", "publisher"];
    // Verificar se existem campos inesperados
    const invalidFields = Object.keys(book).filter((field) => !validFields.includes(field));
    if (invalidFields.length > 0) {
        res.status(400).json({
            message: `Campo no formato errado!: ${invalidFields.join(", ")}`,
        });
        return;
    }
    const payloadBook = {
        title: book.title,
        num_page: book.num_page,
        isbn: book.isbn,
        publisher: book.publisher,
    };
    try {
        const updateBook = yield books_module_1.default.findByIdAndUpdate(bookId, {
            $set: payloadBook,
        }, { new: true, strict: true });
        if (!updateBook) {
            res.status(404).json({
                message: "erro ao editar o livro",
            });
            return;
        }
        res.status(200).json({ message: "sucesso", updateBook });
    }
    catch (err) {
        res.status(500).json({
            message: "erro" + err.message,
        });
    }
}));
exports.default = router;
