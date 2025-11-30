const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não foi definida no arquivo .env");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
