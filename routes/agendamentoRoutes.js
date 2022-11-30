const moment = require("moment/moment");

const Agendamento = require("../models/Agendamento");

const router = require("express").Router();

router.post("/novo", async (req, res) => {
  const {
    status,
    data,
    cliente,
    pet,
    servico,
    transporte,
    carrapatos,
    pulgas,
    feridas,
    obs,
  } = req.body;

  const agendamento = {
    status,
    data,
    cliente,
    pet,
    servico,
    transporte,
    carrapatos,
    pulgas,
    feridas,
    obs,
  };
  console.log(agendamento.data);
  try {
    await Agendamento.create(agendamento);
    res
      .status(201)
      .json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { data } = req.body;
    const dia = new Date(data).getTime() + 86400000;

    const findData = await Agendamento.find({
      data: {
        $gte: new Date(data),
        $lt: new Date(dia),
      },
    })
      .populate(["pet", "cliente"])
      .sort({ data: 1 });
    res.status(200).json(findData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findOne({
      _id: req.params.id,
    }).populate(["pet", "cliente"]);
    res.status(200).json(agendamento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.patch("/:id/editar", async (req, res) => {
  const {
    status,
    data,
    cliente,
    pet,
    servico,
    transporte,
    carrapatos,
    pulgas,
    feridas,
    obs,
  } = req.body;

  const agendamento = {
    status,
    data,
    cliente,
    pet,
    servico,
    transporte,
    carrapatos,
    pulgas,
    feridas,
    obs,
  };

  try {
    const updatedAgendamento = await Agendamento.updateOne(
      { _id: req.params.id },
      agendamento
    );

    if (updatedAgendamento.matchedCount === 0) {
      res.status(422).json({ message: "Agendamento não encontrado!" });
      return;
    }

    res.status(200).json(updatedAgendamento);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Agendamento.deleteOne({ _id: id });

    res.status(200).json({ message: "Pet removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
