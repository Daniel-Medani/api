const mongoose = require("mongoose");

const PetSchema = mongoose.Schema({
  nome: {
    type: String,
  },
  sexo: {
    type: String,
  },
  idade: {
    type: String,
  },
  raca: {
    type: String,
  },
  dono: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
  },
});

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;
