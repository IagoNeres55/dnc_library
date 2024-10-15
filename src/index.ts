import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.router";
import booksRouter from "./routes/books.router";

import conectionDB from "./config/conection.mongo";
dotenv.config();
const port = process.env.PORT || 3001;

const corsOptions: CorsOptions = {
  origin: ["http://example.com", "http://localhost:3000", "https://meu-site.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app: Express = express();
app.use(cors(corsOptions));
app.use(express.json());
conectionDB();

app.use(userRouter);
app.use(booksRouter);

app.listen(port, () => {
  console.log("server is running", port);
});
