// Import necessary modules
const express = require("express");
const cors = require("cors");
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;
const { parse } = require("dotenv");


//LEADS: post, getx2, putx3
// da sistemare post

// POST: create a new lead
// closure_type è vuoto dopo la creazione con questa lead
// modificare id_user quando ci verrà messo un login, prenderlo tramite get?
// chiedere come gestire closure_type
router.post("/newLead", async (req, res) => {
  const {
    activity_description,
    budget,
    lead_data,
    silo,
    id_client,
    id_user,
    notes,
    closure_type
  } = req.body;

  try {
    const pool = await poolPromise;

    // Check if client exists and get its ID
    const clientResult = await pool.request()
      .input("id_client", sql.Int, id_client)
      .query("SELECT id FROM clients WHERE id = @id_client");

    if (clientResult.recordset.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    // const id_client = clientResult.recordset[0].id;


    // Check if user exists and get its ID
    const userResult = await pool.request()
      .input("id_user", sql.Int, id_user)
      .query("SELECT id, first_name, last_name FROM users WHERE id = @id_user");

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const owner = `${userResult.recordset[0].first_name} ${userResult.recordset[0].last_name}`;
    // const { id: id_user, username: owner } = userResult.recordset[0];


    // Use the lead_data from request body, or current date if not provided
    const leadDate = lead_data ? new Date(lead_data) : new Date();


    // CREAZIONE UNIQUE SPEAKING CODE
    const siloPrefix = silo.slice(0, 3).toUpperCase();
    const formattedDate = leadDate.toLocaleDateString("it-IT", {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '-');

    const codePattern = `${siloPrefix}-${formattedDate}-%`;

    // Query per ottenere l'ultimo numero progressivo per questo silo e data
    const result = await pool.request()
      .input("pattern", sql.VarChar, codePattern)
      .query(`
        SELECT TOP 1 unique_speaking_code
        FROM leads
        WHERE unique_speaking_code LIKE @pattern
        ORDER BY unique_speaking_code DESC
      `);

    let progressiveNumber;
    if (result.recordset.length === 0) {
      progressiveNumber = '0001';
    } else {
      const lastCode = result.recordset[0].unique_speaking_code;
      const lastNumber = parseInt(lastCode.split('-').pop());
      const nextNumber = lastNumber + 1;
      progressiveNumber = nextNumber.toString().padStart(4, '0');
    }

    const unique_speaking_code = `${siloPrefix}-${formattedDate}-${progressiveNumber}`;
    const last_activity_date = leadDate;


    // Insert lead with all available fields from the schema
    await pool.request()
      .input("activity_description", sql.VarChar, activity_description)
      .input("budget", sql.Decimal, budget)
      .input("lead_data", sql.DateTime, leadDate)
      .input("silo", sql.VarChar, silo)
      .input("id_client", sql.Int, id_client)
      .input("id_user", sql.Int, id_user)
      .input("owner", sql.VarChar, owner)
      .input("last_activity_date", sql.DateTime, last_activity_date)
      .input("unique_speaking_code", sql.VarChar, unique_speaking_code)
      .input("notes", sql.VarChar, notes || null)
      .input("closure_type", sql.VarChar, closure_type || null)
      .query(`
        INSERT INTO leads (
          activity_description,
          archived,
          budget,
          converted,
          lead_data,
          silo,
          id_client,
          id_user,
          owner,
          last_activity_date,
          unique_speaking_code,
          notes,
          closure_type
        )
        VALUES (
          @activity_description,
          0,
          @budget,
          0,
          @lead_data,
          @silo,
          @id_client,
          @id_user,
          @owner,
          @last_activity_date,
          @unique_speaking_code,
          @notes,
          @closure_type
        )
      `);

    res.status(201).json({ message: "Lead created successfully" });
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//GET: get all leads
router.get("/getLeads", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT
            leads.id,
            unique_speaking_code,
            clients.company_name,
            lead_data,
            budget,
            owner,
            archived,
            converted
        FROM leads
        JOIN clients ON leads.id_client = clients.id
        WHERE archived = 0
        AND
        converted = 0
        ORDER BY leads.id DESC;`);

    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//GET: get lead by ID
router.get("/getLead/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT
            leads.id_client,
            leads.lead_data,
            leads.unique_speaking_code,
            leads.activity_description,
            leads.budget,
            leads.last_activity_date,
            leads.silo,
            leads.closure_type,
            leads.archived,
            clients.company_name,
            clients.contact_name,
            clients.contact_role,
            clients.contact_email,
            clients.contact_phone,
            leads.notes
        FROM leads
        JOIN clients ON leads.id_client = clients.id
        WHERE leads.id = @id AND leads.archived = 0;
        `);

    if (result.recordset.length === 0) {
      return res.status(404).send("Lead not found");
    }

    res.json(result.recordset[0]);
    console.log('Fetched lead by ID:', result.recordset[0]);
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).send("Server Error");
  }
});

//PUT: modify a lead by id
router.put("/modifyLead/:id", async (req, res) => {
  const { id } = req.params;
  //closure_type, notes non vengono modificati e rimangono vuoti
  const {
    id_client,
    activity_description,
    budget,
    silo,
    notes
  } = req.body;

  try {
    const pool = await poolPromise;

    //ogni volta che viene chiamato una put per una modifica, last_activity_date viene aggiornato alla data corrente
    const last_activity_date = new Date();

    await pool.request()
      .input("id", sql.Int, id)
      .input("id_client", sql.Int, id_client)
      .input("activity_description", sql.VarChar, activity_description)
      .input("budget", sql.Decimal, budget)
      .input("silo", sql.VarChar, silo)
      .input("last_activity_date", sql.DateTime, last_activity_date)
      .input("notes", sql.VarChar, notes)
      .query(`
        UPDATE leads
        SET
          id_client = @id_client,
          activity_description = @activity_description,
          budget = @budget,
          last_activity_date = @last_activity_date,
          silo = @silo,
          notes = @notes
        WHERE leads.id = @id
      `);

    res.status(200).json({ message: "Lead updated successfully" });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//PUT: convert a lead by id
router.put("/convertLead/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE leads
        SET
          converted = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "Lead converted successfully" });
  } catch (err) {
    console.error("Error converting lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT: archive a lead by id
router.put("/archiveLead/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE leads
        SET
          archived = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "Lead archived successfully" });
  } catch (err) {
    console.error("Error archiving lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT: archive a lead by id
router.put("/restoreLead/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE leads
        SET
          archived = 0
        WHERE id = @id
      `);

    res.status(200).json({ message: "Lead restored successfully" });
  } catch (err) {
    console.error("Error restopring lead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//get archived
router.get("/getArchivedLeads", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`SELECT
            leads.id,
            leads.unique_speaking_code,
            leads.id_client,
            leads.lead_data,
            leads.activity_description,
            leads.budget,
            leads.owner,
            leads.converted,
            leads.closure_type,
            clients.company_name,
            clients.contact_name,
            clients.contact_role,
            clients.contact_email,
            clients.contact_phone
        FROM leads
        JOIN clients ON leads.id_client = clients.id
        WHERE leads.archived = 1`);

    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;