const Agendamento = require("../models/Agendamento");

const router = require("express").Router();

router.post("/novo", async (req, res) => {
  const {
    status,
    data,
    hora,
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
    hora,
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

module.exports = router;
