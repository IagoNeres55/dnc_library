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
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const url = process.env.MONGODB_URI || "";
// mongoose
//   .connect(url)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });
const conectionDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.connection.readyState) {
            yield mongoose_1.default.connect(url);
        }
        else {
            console.log("Erro ao conectar no banco");
        }
        console.log("Conexão com o banco feita com sucesso!");
    }
    catch (err) {
        console.error("Falha ao tentar concetar com o banco", err);
        throw new Error(err);
    }
});
exports.default = conectionDB;
// const closeSession = async () => {
//   try {
//     if (mongoose.connection.readyState) {
//       await mongoose.connection.close();
//     } else {
//       console.log("A sessão já estava encerrada.");
//     }
//   } catch (err) {
//     console.error("Falha ao fechar sessão e desconectar", err);
//     throw err;
//   }
// };
// export {conectionDB, closeSession};
