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
    data: moment.parseZone(data).local().format(),
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
    await Agendamento.create(agendamento);
    res
      .status(201)
      .json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const agendamento = await Agendamento.find();

    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Agendamento.deleteMany();

    res.status(200).json({ message: "Pet removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
