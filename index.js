// config inicial
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// forma de ler JSON / middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.json());

// rotas da API

const clienteRoutes = require("./routes/clienteRoutes");
const petRoutes = require("./routes/petRoutes");

app.use("/clientes", clienteRoutes);
app.use("/pets", petRoutes);

// rota inicial / endpoint
app.get("/", (req, res) => {
  // mostrar req

  res.json({ message: "Oi Express!" });
});

// entregar uma porta
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.foafekh.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectamos ao MongoDB!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
