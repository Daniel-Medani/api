const mongoose = require("mongoose");

const AgendamentoSchema = mongoose.Schema({
  status: {
    type: String,
  },
  data: {
    type: Date,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
  },
  servico: {
    type: String,
  },
  transporte: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  carrapatos: {
    type: Boolean,
  },
  pulgas: {
    type: Boolean,
  },
  feridas: {
    type: Boolean,
  },
  obs: {
    type: String,
  },
});

const Agendamento = mongoose.model("Agendamento", AgendamentoSchema);

module.exports = Agendamento;
