const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

router.post("/novo", async (req, res) => {
  const { nomeUsuario, email, senha } = req.body;

  const usuExiste = await Usuario.findOne({ email: email });

  // checar email
  if (usuExiste) {
    return res.status(422).json({ message: "Email em uso" });
  }
  // criar senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(senha, salt);

  // criar usuário
  const usu = new Usuario({
    nomeUsuario,
    email,
    senha: passwordHash,
  });
  try {
    await usu.save();

    res.status(200).json({ msg: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

function checarToken(req, res, next) {
  const authHeader = req.header["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const usuario = await Usuario.findById(id, "-senha");

    if (!usuario) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.patch("/:id/editar", async (req, res) => {
  const { nomeUsuario, senha, email, funcao } = req.body;

  const usuario = {
    nomeUsuario,
    senha,
    email,
    funcao,
  };

  try {
    const updatedUsuario = await Usuario.updateOne(
      { _id: req.params.id },
      usuario
    );

    if (updatedUsuario.matchedCount === 0) {
      res.status(422).json({ message: "Usuario não encontrado!" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Delete - deletar dados
router.delete("/:id", async (req, res) => {
  const usuario = await Usuario.findOne({ _id: req.params.id });

  if (!usuario) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }

  try {
    await Usuario.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
