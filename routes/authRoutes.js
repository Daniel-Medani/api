const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "Email obrigatório!" });
  }

  if (!senha) {
    return res.status(422).json({ msg: "Senha obrigatória!" });
  }

  // checa se o usuário existe
  const usu = await Usuario.findOne({ email: email });

  if (!usu) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  //   checar senha
  const checarSenha = senha === usu.senha;

  if (!checarSenha) {
    return res.status(404).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: usu._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
