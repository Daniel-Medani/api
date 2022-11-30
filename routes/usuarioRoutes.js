const router = require("express").Router();
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  const { nomeUsuario, senha, email, funcao } = req.body;

  const usuario = {
    nomeUsuario,
    senha,
    email,
    funcao,
  };

  try {
    await Usuario.create(usuario);
    res
      .status(201)
      .json({ message: "Usuário inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id });

    if (!usuario) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json(usuario);
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
