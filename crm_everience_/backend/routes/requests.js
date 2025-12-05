// Import necessary modules
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;


//GET: get all requests
/*
router.get("/getRequests", async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const result = await pool
      .request()
      .query(`
        SELECT 
  requests.id,
  COALESCE(leads.unique_speaking_code, requests.request_code) AS request_code,
  requests.request_date,
  clients.company_name,
  requests.assigned_service_manager,
  requests.assigned_recruiter,
  clients.contact_name,
  clients.contact_email,
  clients.partita_iva,
  requests.status,
  requests.id_pnl, 
  requests.has_pnl
  requests.budget
FROM requests
LEFT JOIN opportunities ON requests.id_opportunity = opportunities.id
LEFT JOIN leads ON opportunities.id_lead = leads.id
LEFT JOIN clients ON requests.final_client = clients.company_name
WHERE requests.archived = 0
  AND requests.converted = 0;
      `);

    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
// */

//GET: get all requests
router.get("/getRequests", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        r.id,
        r.request_code,
        r.request_date,       
        r.assigned_service_manager AS request_assigned_service_manager,
        r.assigned_recruiter,
        r.budget,
        r.has_pnl,
        r.final_client,
        r.archived,

        -- Opportunity fields
        o.assigned_service_manager AS opportunity_assigned_service_manager,

        -- Lead fields
        l.unique_speaking_code,
        l.owner,

        -- Client fields
        c.company_name,
        c.address AS client_address,
        c.municipality,
        c.zip_code,
        c.province,
        c.city,
        c.partita_iva,
        c.codice_fiscale,
        c.pec,
        c.sdi_code,
        c.billing_email,
        c.contact_name AS client_contact_name,
        c.contact_email AS client_contact_email,
        c.contact_phone AS client_contact_phone,
        c.contact_role,
        c.ateco

      FROM requests r
      LEFT JOIN opportunities o ON r.id_opportunity = o.id
      LEFT JOIN leads l ON o.id_lead = l.id
      LEFT JOIN clients c ON l.id_client = c.id
      WHERE r.archived = 0 AND r.converted = 0
      ORDER BY r.id DESC;
    `);

    res.json(result.recordset);
    console.log('executed', result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/getRequest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
        r.id,
        r.id_pnl,
        r.request_code,
        r.request_date,
        r.status,
        r.assigned_service_manager AS request_assigned_service_manager,
        r.assigned_recruiter,
        r.budget,
        r.has_pnl,
        r.final_client,
        r.archived,
        r.start_date,
        r.end_date,
        r.service_duration,
        r.week_working_days,
        r.clock_in,
        r.clock_out,
        r.resources_quantity,
        r.address,
        r.contract_typology,
        r.back_fill,

        -- Opportunity fields
        o.assigned_service_manager AS opportunity_assigned_service_manager,

        -- Lead fields
        l.activity_description AS lead_activity_description,
        l.lead_data,
        l.silo,
        l.unique_speaking_code,
        l.last_activity_date,
        l.owner,

        -- Client fields
        c.company_name,
        c.address AS client_address,
        c.municipality,
        c.zip_code,
        c.province,
        c.city,
        c.partita_iva,
        c.codice_fiscale,
        c.pec,
        c.sdi_code,
        c.billing_email,
        c.contact_name AS client_contact_name,
        c.contact_email AS client_contact_email,
        c.contact_phone AS client_contact_phone,
        c.contact_role,
        c.ateco

      FROM requests r
      LEFT JOIN opportunities o ON r.id_opportunity = o.id
      LEFT JOIN leads l ON o.id_lead = l.id
      LEFT JOIN clients c ON l.id_client = c.id
      WHERE r.id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send("Request not found");
    }

    // Assign the fetched record to a variable
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

    // Send the formatted record to the client
    res.json(requestRecord);

    console.log("Fetched request by ID:", requestRecord);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).send("Server Error");
  }
});


//PUT: modify a request by id
router.put("/modifyRequest/:id", async (req, res) => {
  const { id } = req.params;
  const {
    resources_quantity,
    description,
    contract_typology,
    week_working_days,
    service_duration,
    back_fill,
    address,
    clock_in,
    clock_out,
    status,
    assigned_service_manager,
    assigned_recruiter,
    start_date,
    end_date,
  } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .input("resources_quantity", sql.Int, resources_quantity)
      .input("description", sql.VarChar, description)
      .input("contract_typology", sql.VarChar, contract_typology)
      .input("week_working_days", sql.Int, week_working_days)
      .input("service_duration", sql.Int, service_duration)
      .input("back_fill", sql.TinyInt, back_fill)
      .input("address", sql.VarChar, address)
      .input("clock_in", sql.VarChar, clock_in)
      .input("clock_out", sql.VarChar, clock_out)
      .input("status", sql.VarChar, status)
      .input("assigned_service_manager", sql.VarChar, assigned_service_manager)
      .input("assigned_recruiter", sql.VarChar, assigned_recruiter)
      .input("start_date", sql.DateTime, start_date)
      .input("end_date", sql.DateTime, end_date)
      .query(`
        UPDATE requests
        SET 
          resources_quantity = @resources_quantity,
          description = @description,
          contract_typology = @contract_typology,
          week_working_days = @week_working_days,
          service_duration = @service_duration,
          back_fill = @back_fill,
          address = @address,
          status = @status,
          assigned_service_manager = @assigned_service_manager,
          assigned_recruiter = @assigned_recruiter,
          start_date = @start_date,
          end_date = @end_date
        WHERE id = @id
      `);

    res.status(200).json({ message: "Request modified successfully" });
  } catch (err) {
    console.error("Error modifying request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT: convert a request by id into contracts(client.contracts)
router.put("/convertRequest/:id", async (req, res) => {
  const { id } = req.params;
  const { service_typology } = req.body;

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1) Mark request as converted
    let request1 = new sql.Request(transaction);
    await request1
      .input("id", sql.Int, id)
      .query(`
        UPDATE requests
        SET converted = 1
        WHERE id = @id
      `);

    // 2) Get id_pnl
    let request2 = new sql.Request(transaction);
    const result = await request2
      .input("id", sql.Int, id)
      .query(`
        SELECT id_pnl 
        FROM requests 
        WHERE id = @id
      `);
    const id_pnl = result.recordset[0].id_pnl;

    // 3) Insert into client_contracts
    let request3 = new sql.Request(transaction);
    await request3
      .input("id_request", sql.Int, parseInt(id))
      .input("id_pnl", sql.Int, id_pnl)
      .input("service_typology", sql.VarChar, service_typology)
      .query(`
        INSERT INTO client_contracts (
          id_request, 
          id_pnl, 
          service_typology
        )
        VALUES (
          @id_request, 
          @id_pnl, 
          @service_typology
        )
      `);

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ message: "Request converted to contract successfully" });
  } catch (err) {
    console.error("Error converting request:", err);
    await transaction.rollback(); // rollback on error
    res.status(500).json({ message: "Internal server error" });
  }
});


//PUT: archive a request by id
router.put("/archiveRequest/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE requests
        SET archived = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "Request archived successfully" });
  } catch (err) {
    console.error("Error archiving request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//get archived
router.get("/getArchivedRequests", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query(`SELECT 
      requests.request_code,
      requests.request_date,
      clients.company_name,
      requests.assigned_service_manager,
      requests.assigned_recruiter,
      clients.contact_name,
      clients.contact_email,
      clients.partita_iva,
      requests.status
      FROM requests
      JOIN clients ON requests.final_client = clients.company_name
      WHERE requests.archived = 1
      `);

    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


router.post("/createPNL", async (req, res) => {
  const {
    resource,
    work_mode,
    quantity_days,
    unit_cost,
    total_cost,
    total_service_cost,
    markup,
    unit_price,
    total_price,
    total_service_price,
    margin_percentage,
    total_gross_margin,
    service_margin_percentage,
    service_gross_margin,
    id_request,
    tools,
    resources
  } = req.body;

  try {
    const pool = await poolPromise;

    const requestResult = await pool
      .request()
      .input("id_request", sql.Int, id_request)
      .query(`SELECT id FROM requests WHERE id = @id_request`);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const insertResult = await pool
      .request()
      .input("resource", sql.VarChar, resource ?? null)
      .input("work_mode", sql.VarChar, work_mode ?? null)
      .input("quantity_days", sql.Int, quantity_days ?? null)
      .input("unit_cost", sql.Decimal(18, 2), unit_cost ?? 0)
      .input("total_cost", sql.Decimal(18, 2), total_cost ?? 0)
      .input("total_service_cost", sql.Decimal(18, 2), total_service_cost ?? 0)
      .input("markup", sql.Decimal(18, 2), markup ?? 0)
      .input("unit_price", sql.Decimal(18, 2), unit_price ?? 0)
      .input("total_price", sql.Decimal(18, 2), total_price ?? 0)
      .input("total_service_price", sql.Decimal(18, 2), total_service_price ?? 0)
      .input("margin_percentage", sql.Decimal(5, 2), margin_percentage ?? 0)
      .input("total_gross_margin", sql.Decimal(18, 2), total_gross_margin ?? 0)
      .input("service_margin_percentage", sql.Decimal(5, 2), service_margin_percentage ?? 0)
      .input("service_gross_margin", sql.Decimal(18, 2), service_gross_margin ?? 0)
      .input("id_request", sql.Int, id_request)
      .query(`
        INSERT INTO pnl (
          resource,
          work_mode,
          quantity_days,
          unit_cost,
          total_cost,
          total_service_cost,
          markup,
          unit_price,
          total_price,
          total_service_price,
          margin_percentage,
          total_gross_margin,
          service_margin_percentage,
          service_gross_margin,
          id_request
        )
        OUTPUT INSERTED.id
        VALUES (
          @resource,
          @work_mode,
          @quantity_days,
          @unit_cost,
          @total_cost,
          @total_service_cost,
          @markup,
          @unit_price,
          @total_price,
          @total_service_price,
          @margin_percentage,
          @total_gross_margin,
          @service_margin_percentage,
          @service_gross_margin,
          @id_request
        );
      `);

    const newPNLId = insertResult.recordset[0].id;

    await pool
      .request()
      .input("id_request", sql.Int, id_request)
      .input("id_pnl", sql.Int, newPNLId)
      .query(`
        UPDATE requests
        SET id_pnl = @id_pnl, has_pnl = 1
        WHERE id = @id_request
      `);

    // tools: existing logic
    if (tools && tools.length > 0) {
      for (const t of tools) {
        await pool
          .request()
          .input("id_pnl", sql.Int, newPNLId)
          .input("tool", sql.VarChar, t.tool)
          .input("daily_cost", sql.Decimal(18, 2), t.daily_cost)
          .input("yearly_cost", sql.Decimal(18, 2), t.yearly_cost)
          .query(`
            INSERT INTO tools_catalogs (id_pnl, tool, daily_cost, yearly_cost)
            VALUES (@id_pnl, @tool, @daily_cost, @yearly_cost)
          `);
      }
    }

    // resources: if present
    if (resources && Array.isArray(resources) && resources.length > 0) {
      for (const r of resources) {
        await pool
          .request()
          .input("pnl_id", sql.Int, newPNLId)
          .input("resource", sql.VarChar, r.resource ?? null)
          .input("quantity_days", sql.Int, r.quantity_days ?? null)
          .input("unit_cost", sql.Decimal(18, 2), r.unit_cost ?? 0)
          .input("total_cost", sql.Decimal(18, 2), r.total_cost ?? 0)
          .input("gross_margin", sql.Decimal(18, 2), r.gross_margin ?? 0)
          .query(`
            INSERT INTO pnl_resources (pnl_id, resource, quantity_days, unit_cost, total_cost, gross_margin)
            VALUES (@pnl_id, @resource, @quantity_days, @unit_cost, @total_cost, @gross_margin)
          `);
      }
    }

    res.status(201).json({
      message: "PNL created successfully",
      pnl_id: newPNLId,
    });

  } catch (err) {
    console.error("Error creating PNL:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/requests/:id/changeHasPNLField", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE requests
        SET has_pnl = 1
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request updated: has_pnl = 1" });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getPNL/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          p.id_request,
          p.resource,
          p.work_mode,
          p.quantity_days,
          p.unit_cost,
          p.total_cost,
          p.total_service_cost,
          p.markup,
          p.unit_price,
          p.total_price,
          p.total_service_price,
          p.margin_percentage,
          p.total_gross_margin,
          p.service_margin_percentage,
          p.service_gross_margin
        FROM pnl p
        WHERE p.id_request = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send("PNL not found");
    }

    const pnlRecord = result.recordset[0];

    res.json(pnlRecord);

    console.log("Fetched PNL by ID:", pnlRecord);
  } catch (err) {
    console.error("Error fetching PNL:", err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;