const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  cpf: {
    type: String,
  },
  endereco: {
    type: String,
  },
  telefone: {
    type: String,
  },
  pets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

const Cliente = mongoose.model("Cliente", ClienteSchema);

module.exports = Cliente;
