const router = require("express").Router();
const Pet = require("../models/Pet");
const Cliente = require("../models/Cliente");

// Create - criação de dados
router.post("/:id/pets", async (req, res) => {
  const { nome, sexo, idade, raca } = req.body;

  const clienteId = req.params.id;

  if (!nome) {
    res.status(422).json({ error: "O nome é obrigatório" });
    return;
  }

  try {
    // criando dados
    const pet = await Pet.create({
      nome,
      sexo,
      idade,
      raca,
      dono: await Cliente.findOne({ _id: clienteId }),
    });

    await Cliente.findByIdAndUpdate(clienteId, {
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

// get by owner
router.get("/:id/pets", async (req, res) => {
  try {
    const pets = await Pet.find({ dono: req.params.id }).populate({
      path: "dono",
      select: "nome",
    });

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// get one
router.get("/:id/pets/:petId", async (req, res) => {
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
router.put("/:id/pets/:petId", async (req, res) => {
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
router.delete("/:id/pets/:petId", async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId });

  if (!pet) {
    res.status(422).json({ message: "O pet não foi encontrado!" });
    return;
  }

  try {
    await Pet.deleteOne({ _id: req.params.petId });
    await Cliente.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { pets: pet._id } }
    );

    res.status(200).json({ message: "Pet removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
