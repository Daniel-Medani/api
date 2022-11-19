const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  nome: String,
  sexo: String,
  idade: Date,
  raca: String,
  dono: { type: mongoose.Types.ObjectId, ref: "Cliente" },
});

module.exports = Pet;
