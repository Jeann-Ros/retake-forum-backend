import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default class MongoConfig {
  static async connect() {
    try {
      const uri = process.env.MONGODB_URI as string;
      if (!uri) {
        throw new Error("MONGODB_URI não configurada.");
      }

      await mongoose.connect(uri);
      console.log("MongoDB conectado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao conectar o MongoDB: ", error.message);
      throw error;
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("MongoDB desconectado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao desconectar o MongoDB:", error.message);
    }
  }
}
