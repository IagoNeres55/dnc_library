"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import cors, { CorsOptions } from "cors";
const dotenv_1 = __importDefault(require("dotenv"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const books_router_1 = __importDefault(require("./routes/books.router"));
const conection_mongo_1 = __importDefault(require("./config/conection.mongo"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
// const corsOptions: CorsOptions = {
//   origin: "http://example.com", // Define a origem permitida
//   methods: ["GET", "POST"], // Define métodos permitidos
//   allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
// };
const app = (0, express_1.default)();
// app.use(cors(corsOptions));
app.use(express_1.default.json());
(0, conection_mongo_1.default)();
app.use(user_router_1.default);
app.use(books_router_1.default);
app.listen(port, () => {
    console.log("server is running", port);
});
