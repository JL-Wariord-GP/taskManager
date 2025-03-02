import mongoose from "mongoose";
import dotenv from "dotenv";

//! Cargamos las variables de entorno
dotenv.config();

//! Configuramos la conexion a Mongoose (DB MongoDB)
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || "";
    if (!mongoURI) {
      throw new Error("There is no MongoDB URI configured");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
