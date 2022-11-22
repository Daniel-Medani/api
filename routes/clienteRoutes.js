const router = require("express").Router();

const Cliente = require("../models/Cliente");

// Create - criação de dados
router.post("/", async (req, res) => {
  // req.body

  const { nome, cpf, endereco, telefone, pet } = req.body;

  if (!nome) {
    res.status(422).json({ error: "O nome é obrigatório" });
    return;
  }

  const cliente = {
    nome,
    cpf,
    endereco,
    telefone,
    pet,
  };

  try {
    // criando dados
    await Cliente.create(cliente);

    res
      .status(201)
      .json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().populate("pets");

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  // extrair o dado da requisição
  const id = req.params.id;

  try {
    const cliente = await Cliente.findOne({ _id: id }).populate("pets");

    if (!cliente) {
      res.status(422).json({ message: "O cliente não foi encontrado!" });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update - atualização de dados (PUT, PATCH)
router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const { nome, cpf, endereco, telefone, pet } = req.body;

  const cliente = {
    nome,
    cpf,
    endereco,
    telefone,
    pet,
  };

  try {
    const updatedCliente = await Cliente.updateOne({ _id: id }, cliente);

    if (updatedCliente.matchedCount === 0) {
      res.status(422).json({ message: "O cliente não foi encontrado!" });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Delete - deletar dados
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const cliente = await Cliente.findOne({ _id: id });

  if (!cliente) {
    res.status(422).json({ message: "O cliente não foi encontrado!" });
    return;
  }

  try {
    await Cliente.deleteOne({ _id: id });

    res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
