"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const booksSchema = new Schema({
    title: { type: String, require: true },
    num_page: { type: Number, require: true },
    isbn: { type: String, require: true },
    publisher: { type: String, require: true },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" },
}, {
    timestamps: true,
});
const booksModel = mongoose_1.default.model("books", booksSchema);
exports.default = booksModel;
