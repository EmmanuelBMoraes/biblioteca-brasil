const mongoose = require("mongoose");

const bibliotecaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  livros: [{ type: mongoose.Schema.Types.ObjectId, ref: "Livro" }],
});

module.exports = mongoose.model("Biblioteca", bibliotecaSchema);
