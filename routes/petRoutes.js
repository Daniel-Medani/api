const router = require("express").Router();
const db = require("../models");
const Pet = require("../models/Pet");

// Create - criação de dados
router.post("/", async (req, res) => {
  const { nome, sexo, idade, raca, dono } = req.body;

  if (!nome) {
    res.status(422).json({ error: "O nome é obrigatório" });
    return;
  }

  try {
    // criando dados
    const pet = await Pet.create({ nome, sexo, idade, raca });
    await db.Cliente.findByIdAndUpdate(dono, {
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

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  // extrair o dado da requisição
  try {
    const pet = await Pet.findOne({ _id: req.params.id });

    if (!pet) {
      res.status(422).json({ message: "O pet não foi encontrado!" });
      return;
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update - atualização de dados (PUT, PATCH)
router.patch("/:id", async (req, res) => {
  const { nome, sexo, idade, raca } = req.body;

  const pet = {
    nome,
    sexo,
    idade,
    raca,
  };

  try {
    const updatedPet = await Pet.updateOne({ _id: req.params.id }, pet);

    if (updatedPet.matchedCount === 0) {
      res.status(422).json({ message: "O Pet não foi encontrado!" });
      return;
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Delete - deletar dados
router.delete("/:id", async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id });

  if (!pet) {
    res.status(422).json({ message: "O pet não foi encontrado!" });
    return;
  }

  try {
    await Pet.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Pet removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
