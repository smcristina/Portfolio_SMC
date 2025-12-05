const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("../db/db");
const router = express.Router();
const app = express();
const PORT = 3000;

//Tipologie di contratto
router.get("/contractTypes", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`SELECT * FROM contract_types ORDER BY name`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching contract types:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Seniority levels
router.get("/level", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`SELECT * FROM levels ORDER BY name`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching contract types:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


