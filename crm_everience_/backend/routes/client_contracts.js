// Import necessary modules
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;


//CONTRACTS: post, get x2, put

// POST: create a new contract
/*router.post("/newContract", async (req, res) => { // stato non viene creato
  const {
    id_request,
    id_pnl,
    service_typology,
    archived // posso metterlo a 0 già qui
  } = req.body;

  try {
    const pool = await poolPromise;

    // get id_request
    const requestResult = await pool.request()
      .input("id_request", sql.Int, id_request)
      .query("SELECT id FROM requests WHERE id = @id_request");

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    // get id_pnl
    const pnlResult = await pool.request()
      .input("id_pnl", sql.Int, id_pnl)
      .query("SELECT id FROM pnl WHERE id = @id_pnl");

    if (pnlResult.recordset.length === 0) {
      return res.status(404).json({ message: "P&L not found" });
    }

    await pool.request()
      .input("id_request", sql.Int, id_request)
      .input("id_pnl", sql.Int, id_pnl)
      .input("service_typology", sql.VarChar, service_typology)
      .input("archived", sql.TinyInt, archived) // posso metterlo a 0 già qui
      .query(`
        INSERT INTO client_contracts (
          id_request,
          id_pnl,
          service_typology,
          archived
        ) VALUES (
         @id_request,
         @id_pnl,
         @service_typology,
         0
        )
        `);

    res.status(201).json({ message: "Contract creates successfully" });
  } catch (err) {
    console.error("Error creating contract:", err);
    res.status(500).json({ message: "Internal server errror" });
  }
});
*/


//GET: get all contracts
router.get("/getContracts", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        cc.id,
        r.request_code,
        r.final_client,
        r.start_date,
        r.end_date,
        r.contract_typology,
        p.resource,
        o.new_sale,
        l.unique_speaking_code,
        l.activity_description,
        c.company_name
      FROM client_contracts cc
      INNER JOIN requests r ON cc.id_request = r.id
      LEFT JOIN pnl p ON r.id_pnl = p.id
      LEFT JOIN opportunities o ON r.id_opportunity = o.id
      LEFT JOIN leads l ON o.id_lead = l.id
      LEFT JOIN clients c ON l.id_client = c.id
      WHERE cc.archived = 0
      ORDER BY cc.id DESC;
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching contracts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//GET: get a contract by id
router.get("/getContract/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT

        cc.id,
        cc.stato,

        c.address,
        c.company_name,
        c.partita_iva,
        c.contact_name,
        c.contact_email,
        c.contact_phone,

        r.assigned_service_manager,
        r.assigned_recruiter,
        r.resources_quantity,
        r.address,
        r.week_working_days,
        r.service_duration,
        r.back_fill,
        r.description,
        r.start_date,
        r.end_date,
        r.contract_typology,
        r.budget,
        r.clock_in,
        r.clock_out,
        r.request_code,
        r.final_client,
        r.request_date,

        p.resource,

        o.new_sale,

        l.unique_speaking_code,
        l.activity_description
       
      FROM client_contracts cc
      INNER JOIN requests r ON cc.id_request = r.id
      LEFT JOIN pnl p ON r.id_pnl = p.id
      LEFT JOIN opportunities o ON r.id_opportunity = o.id
      LEFT JOIN leads l ON o.id_lead = l.id
      LEFT JOIN clients c ON l.id_client = c.id
        WHERE cc.id = @id AND cc.archived = 0`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const contractRecord = result.recordset[0];

    // Format clock_in and clock_out
    if (contractRecord.clock_in instanceof Date) {
      const h = contractRecord.clock_in.getUTCHours().toString().padStart(2, '0');
      const m = contractRecord.clock_in.getUTCMinutes().toString().padStart(2, '0');
      contractRecord.clock_in = `${h}:${m}`;
    }

    if (contractRecord.clock_out instanceof Date) {
      const h = contractRecord.clock_out.getUTCHours().toString().padStart(2, '0');
      const m = contractRecord.clock_out.getUTCMinutes().toString().padStart(2, '0');
      contractRecord.clock_out = `${h}:${m}`;
    }

    res.status(200).json(contractRecord);


  } catch (err) {
    console.error("Error fetching contract:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



//PUT: archive a contract by id
router.put("/archiveContract/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE client_contracts SET archived = 1 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json({ message: "Contract archived successfully" });
  } catch (err) {
    console.error("Error archiving contract:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get archived
router.get("/getArchivedContracts", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT 
        requests.request_code,
        requests.final_client,
        requests.start_date,
        requests.end_date,
        requests.contract_typology,
        requests.activity_description
        FROM client_contracts
        INNER JOIN requests ON client_contracts.id_request = requests.id
        WHERE client_contracts.archived = 1`
      );

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching contracts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;