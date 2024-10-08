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

const openSession = async () => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(url);
    } else {
      console.log("erro ao conectar no banco");
    }
  } catch (err) {
    console.error("Falha ao tentar concetar com o banco", err);
    throw err;
  }
};

const closeSession = async () => {
  try {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
    } else {
      console.log("A sessão já estava encerrada.");
    }
  } catch (err) {
    console.error("Falha ao fechar sessão e desconectar", err);
    throw err;
  }
};

export {openSession, closeSession};
