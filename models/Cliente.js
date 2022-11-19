const mongoose = require("mongoose");

const Cliente = mongoose.model("Cliente", {
  nome: String,
  cpf: String,
  endereco: String,
  telefone: String,
  pet: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

module.exports = Cliente;
