const mongoose = require("mongoose");

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  anoPublicacao: {
    type: Number,
  },
  genero: {
    type: String,
  },
  isbn: {
    type: String,
    required: [true, "ISBN é obrigatório"],
    unique: true,
  },
  disponivel: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Livro", livroSchema);
