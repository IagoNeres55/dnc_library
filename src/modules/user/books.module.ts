import mongoose from "mongoose";
const { Schema } = mongoose;

const booksSchema = new Schema(
  {
    title: { type: String, require: true },
    num_page: { type: Number, require: true },
    isbn: { type: String, require: true },
    publisher: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const booksModel = mongoose.model("books", booksSchema);

export default booksModel;
