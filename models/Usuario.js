const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
  nomeUsuario: {
    type: String,
  },
  senha: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  funcao: {
    type: String,
  },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

module.exports = Usuario;
