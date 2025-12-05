// Import necessary modules
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;



//OPPORTUNITES: post, get x2, put x3

//POST: create a new opportunity, viene presa da lead
router.post("/newOpportunity", async (req, res) => {
  const {//mancano activity_description, closure_type
    id_lead,
    assigned_service_manager,
    // opportunity_date,
    new_sale,
    archived,
    converted
  } = req.body;

  try {
    const pool = await poolPromise;

    // prendo id_lead
    const leadResult = await pool.request()
      .input("id_lead", sql.Int, id_lead)
      .query(`SELECT id from leads WHERE id = @id_lead`);

    if (leadResult.recordset.length === 0) {
      return res.status(404).json({ message: "Lead non trovata" });
    }

    // creo opportunity_date
    const opportunity_date = new Date();


    await pool.request()
      .input("assigned_service_manager", sql.VarChar, assigned_service_manager)
      .input("opportunity_date", sql.DateTime, opportunity_date)
      .input("new_sale", sql.TinyInt, new_sale)
      // .input("archived", sql.TinyInt, archived)
      // .input("converted", sql.TinyInt, converted)
      .input("id_lead", sql.Int, id_lead)
      .query(`
        INSERT INTO opportunities (
          assigned_service_manager,
          opportunity_date,
          new_sale,
          archived,
          converted,
          id_lead
        ) VALUES (
          @assigned_service_manager,
          @opportunity_date,
          @new_sale,
          0,
          0,
          @id_lead
          )
      `);

    res.status(201).json({ message: "Opportunity created successfully" });
  } catch (err) {
    console.error("Error creating opportunity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



//GET: get all opportunities
router.get("/getOpportunities", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT
    opportunities.id,
      leads.unique_speaking_code,
      opportunities.opportunity_date,
      clients.company_name,
      opportunities.assigned_service_manager,
      clients.contact_name,
      clients.contact_email,
      leads.budget,
      clients.partita_iva,
      leads.owner
 
      FROM opportunities
      JOIN leads ON opportunities.id_lead = leads.id
      JOIN clients ON leads.id_client = clients.id
      WHERE opportunities.archived = 0 
      AND opportunities.converted = 0
      ORDER BY opportunities.id DESC`);
    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



//GET: get an opportunity by id
router.get("/getOpportunity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT
      opportunities.id,
      leads.unique_speaking_code,
      opportunities.opportunity_date,
      clients.company_name,
      clients.partita_iva,
      clients.ateco,
      clients.contact_name,
      clients.contact_role,
      clients.contact_email,
      clients.contact_phone,
      opportunities.assigned_service_manager,
      leads.owner,
      leads.silo,
      leads.activity_description,
      leads.budget
      FROM opportunities
      JOIN leads ON opportunities.id_lead = leads.id
      JOIN clients ON leads.id_client = clients.id
      WHERE opportunities.id = @id and opportunities.archived = 0`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    console.log("Fetched opportunity by ID:", result.recordset[0]);
    res.json(result.recordset[0]);

  } catch (err) {
    console.error("Error fetching opportunity:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//PUT: modify an opportunity by id
// closure_type non viene mai inserito
//PUT: modify an opportunity by id
router.put("/modifyOpportunity/:id", async (req, res) => {
  const { id } = req.params;
  const {
    assigned_service_manager,
    activity_description,
    opportunity_date,
    budget
  } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("assigned_service_manager", sql.VarChar, assigned_service_manager)
      .input("activity_description", sql.VarChar, activity_description)
      .input("opportunity_date", sql.Date, opportunity_date)
      .input("budget", sql.Decimal, budget)
      .query(`
       UPDATE opportunities
       SET
         assigned_service_manager = @assigned_service_manager,
         activity_description = @activity_description,
         opportunity_date = @opportunity_date,
         budget = @budget
       OUTPUT 
         inserted.id,
         inserted.assigned_service_manager,
         inserted.activity_description,
         inserted.opportunity_date,
          inserted.budget
       WHERE id = @id
     `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(result.recordset[0]);

  } catch (err) {
    console.error("Error updating opportunity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//PUT: convert an opportunity by id and create a new request
// sistemare id_pnl e quindi has_pnl
router.put("/convertOpportunity/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE opportunities
        SET
          converted = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "Opportunity converted successfully" });
  } catch (err) {
    console.error("Error converting opportunity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



//PUT: archive an opportunity by id
router.put("/archiveOpportunity/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE opportunities
        SET
          archived = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "Opportunity archived successfully" });
  } catch (err) {
    console.error("Error archiving opportunity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: convert an opportunity into a request + convert oppo
router.post("/convertOpportunity/:id", async (req, res) => {
  const { id } = req.params; // opportunity id

  try {
    const pool = await poolPromise;

    // Get opportunity info + lead unique_speaking_code
    const oppResult = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          o.id,
          o.assigned_service_manager,
          o.budget,
          o.id_lead,
          o.opportunity_date,
          l.unique_speaking_code,
          l.owner
        FROM opportunities o
        INNER JOIN leads l ON o.id_lead = l.id
        WHERE o.id = @id
      `);

    if (oppResult.recordset.length === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const opportunity = oppResult.recordset[0];

    // Mark opportunity as converted
    await pool.request()
      .input("id", sql.Int, id)
      .query(`UPDATE opportunities SET converted = 1 WHERE id = @id`);

    const {
      contract_typology,
      address,
      employee_seniority,
      clock_in,
      clock_out,
      resources_quantity,
      week_working_days,
      service_duration,
      back_fill,
      description,
      status,
      final_client,
      start_date,
      end_date,
      budget,
      has_pnl = 0,
      archived = 0,
    } = req.body;

    let budgetVal = budget ?? opportunity.budget ?? 0;
    const start_date_val = start_date ? new Date(start_date) : null;
    const end_date_val = end_date ? new Date(end_date) : null;
    const request_date = new Date();

    // Insert new request into DB
    await pool.request()
      .input("id_opportunity", sql.Int, opportunity.id)
      .input("request_date", sql.DateTime, request_date)
      .input("employee_seniority", sql.VarChar, employee_seniority)
      .input("contract_typology", sql.VarChar, contract_typology)
      .input("address", sql.VarChar, address)
      .input("clock_in", sql.VarChar, clock_in)      // keep as VarChar for TIME(7)
      .input("clock_out", sql.VarChar, clock_out)    // keep as VarChar for TIME(7)
      .input("final_client", sql.VarChar, final_client)
      .input("start_date", sql.Date, start_date_val)
      .input("end_date", sql.Date, end_date_val)
      .input("resources_quantity", sql.Int, resources_quantity)
      .input("week_working_days", sql.Int, week_working_days)
      .input("service_duration", sql.Int, service_duration)
      .input("back_fill", sql.TinyInt, back_fill)
      .input("description", sql.VarChar, description)
      .input("status", sql.VarChar, status)
      .input("budget", sql.Decimal(10, 2), budgetVal)
      .input("archived", sql.TinyInt, archived)
      .input("has_pnl", sql.TinyInt, has_pnl)
      .input("request_code", sql.VarChar, opportunity.unique_speaking_code)
      .input("assigned_service_manager", sql.VarChar, opportunity.assigned_service_manager)
      .query(`
        INSERT INTO requests (
          id_opportunity, request_date, employee_seniority, contract_typology,
          address, clock_in, clock_out, final_client, start_date, end_date,
          resources_quantity, week_working_days, service_duration,
          back_fill, description, status, budget, archived, has_pnl, request_code, assigned_service_manager
        ) VALUES (
          @id_opportunity, @request_date, @employee_seniority, @contract_typology,
          @address, @clock_in, @clock_out, @final_client, @start_date, @end_date,
          @resources_quantity, @week_working_days, @service_duration,
          @back_fill, @description, @status, @budget, @archived, @has_pnl, @request_code, @assigned_service_manager
        )
      `);

    // Fetch the last inserted request for this opportunity
    const result = await pool.request()
      .input("id_opportunity", sql.Int, opportunity.id)
      .query("SELECT TOP 1 * FROM requests WHERE id_opportunity = @id_opportunity ORDER BY id DESC");

    // Format clock_in and clock_out as "HH:mm" strings in the API response
    const requestRecord = result.recordset[0];

    // Convert TIME(7) Date objects to "HH:mm"
    if (requestRecord.clock_in instanceof Date) {
      const h = requestRecord.clock_in.getUTCHours().toString().padStart(2, '0');
      const m = requestRecord.clock_in.getUTCMinutes().toString().padStart(2, '0');
      requestRecord.clock_in = `${h}:${m}`;
    }

    if (requestRecord.clock_out instanceof Date) {
      const h = requestRecord.clock_out.getUTCHours().toString().padStart(2, '0');
      const m = requestRecord.clock_out.getUTCMinutes().toString().padStart(2, '0');
      requestRecord.clock_out = `${h}:${m}`;
    }

    res.status(201).json(requestRecord);

  } catch (err) {
    console.error("Error converting opportunity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



//get archived
router.get("/getArchivedOpportunities", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT
    opportunities.id,
      leads.unique_speaking_code,
      opportunities.opportunity_date,
      clients.company_name,
      opportunities.assigned_service_manager,
      clients.contact_name,
      clients.contact_email,
      leads.budget,
      clients.partita_iva,
      leads.owner

      FROM opportunities
      JOIN leads ON opportunities.id_lead = leads.id
      JOIN clients ON leads.id_client = clients.id
      WHERE opportunities.archived = 1`);
    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
