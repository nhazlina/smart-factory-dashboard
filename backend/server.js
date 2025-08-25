const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/machines", (req, res) => {
  const machines = [
    {
      id: "M1",
      temperature: (60 + Math.random() * 30).toFixed(2),
      uptime: Math.floor(Math.random() * 500),
      power: (200 + Math.random() * 50).toFixed(2),
      productionCount: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.9 ? "Error" : "OK"
    },
    {
      id: "M2",
      temperature: (60 + Math.random() * 30).toFixed(2),
      uptime: Math.floor(Math.random() * 500),
      power: (200 + Math.random() * 50).toFixed(2),
      productionCount: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.9 ? "Error" : "OK"
    },
    {
      id: "M3",
      temperature: (60 + Math.random() * 30).toFixed(2),
      uptime: Math.floor(Math.random() * 500),
      power: (200 + Math.random() * 50).toFixed(2),
      productionCount: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.9 ? "Error" : "OK"
    },
    {
      id: "M4",
      temperature: (60 + Math.random() * 30).toFixed(2),
      uptime: Math.floor(Math.random() * 500),
      power: (200 + Math.random() * 50).toFixed(2),
      productionCount: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.9 ? "Error" : "OK"
    }
  ];
  res.json(machines);
});

app.listen(4000, () => console.log("Backend running at http://localhost:4000"));
