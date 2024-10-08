import express, { Express } from "express";
// import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.router";
import conectionDB from "./config/conection.mongo";
dotenv.config();
const port = process.env.PORT || 3001;

// const corsOptions: CorsOptions = {
//   origin: "http://example.com", // Define a origem permitida
//   methods: ["GET", "POST"], // Define métodos permitidos
//   allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
// };

const app: Express = express();
// app.use(cors(corsOptions));
app.use(express.json());

conectionDB();
app.use(userRouter);

app.listen(port, () => {
  console.log("server is running", port);
});
