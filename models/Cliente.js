const mongoose = require("mongoose");

const Cliente = mongoose.model("Cliente", {
  nome: String,
  cpf: String,
  endereco: String,
  telefone: String,
  pet: [{ nome: String, sexo: String, idade: Date, raca: String }],
});

module.exports = Cliente;
