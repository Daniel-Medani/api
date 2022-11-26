const router = require("express").Router();
const Pet = require("../models/Pet");
const Cliente = require("../models/Cliente");

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().populate({
      path: "dono",
      select: "nome",
    });

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  // extrair o dado da requisição
  try {
    const pet = await Pet.findOne({ _id: req.params.id }).populate({
      path: "dono",
      select: "nome",
    });

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
    await Cliente.findOneAndUpdate(
      { pets: pet._id },
      { $pull: { pets: pet._id } }
    );

    res.status(200).json({ message: "Pet removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
