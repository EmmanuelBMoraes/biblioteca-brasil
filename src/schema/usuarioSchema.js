const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  idade: {
    type: Number,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v);
      },
      message: (props) => `${props.value} não é um CPF válido!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Por favor, insira um email válido"],
  },
  livrosEmprestados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Livro" }],
});

module.exports = mongoose.model("Usuario", usuarioSchema);
