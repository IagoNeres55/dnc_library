import mongoose from "mongoose";
import "dotenv/config";

const url: string = process.env.MONGODB_URI || "";

// mongoose
//   .connect(url)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });

const conectionDB = async () => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(url);
    } else {
      console.log("Erro ao conectar no banco");
    }
    console.log("Conexão com o banco feita com sucesso!");
  } catch (err) {
    console.error("Falha ao tentar concetar com o banco", err);
    throw err;
  }
};
export default conectionDB;

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
