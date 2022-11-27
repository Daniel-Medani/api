const router = require("express").Router();

const Cliente = require("../models/Cliente");
const Pet = require("../models/Pet");

// post pet
router.post("/:id/pets", async (req, res) => {
  const { nome, sexo, idade, raca } = req.body;

  try {
    const pet = await Pet.create({
      nome,
      sexo,
      idade,
      raca,
      dono: await Cliente.findOne({ _id: req.params.id }),
    });

    await Cliente.findByIdAndUpdate(req.params.id, {
      $push: {
        pets: {
          nome,
          sexo,
          idade,
          raca,
          _id: pet._id,
        },
      },
    });
    res.status(201).json({ message: "Pet inserido no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// post cliente
router.post("/", async (req, res) => {
  const { nome, cpf, endereco, telefone } = req.body;

  const cliente = {
    nome,
    cpf,
    endereco,
    telefone,
  };

  try {
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
    const clientes = await Cliente.find().populate({
      path: "pets",
      select: "nome",
    });

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ _id: req.params.id }).populate({
      path: "pets",
      select: "nome",
    });

    if (!cliente) {
      res.status(422).json({ message: "O cliente não foi encontrado!" });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id/pets", async (req, res) => {
  try {
    const cliente = await Pet.find({ dono: req.params.id }).populate({
      path: "dono",
      select: "nome",
    });

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
router.patch("/:id/editar", async (req, res) => {
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
    await Pet.deleteMany({ dono: id });

    res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
