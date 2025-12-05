// Import necessary modules
const express = require("express");
const cors = require("cors");
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;


//CLIENTS: post, getx2, put


//POST: create new client
router.post("/newClient", async (req, res) => {
  const {
    address,
    ateco,
    billing_email,
    city,
    codice_fiscale,
    company_name,
    contact_email,
    contact_name,
    contact_phone,
    contact_role,
    partita_iva,
    pec,
    municipality,
    province,
    sdi_code,
    zip_code
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("address", sql.VarChar, address)
      .input("ateco", sql.VarChar, ateco)
      .input("billing_email", sql.VarChar, billing_email)
      .input("city", sql.VarChar, city)
      .input("codice_fiscale", sql.VarChar, codice_fiscale)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_email", sql.VarChar, contact_email)
      .input("contact_name", sql.VarChar, contact_name)
      .input("contact_phone", sql.VarChar, contact_phone)
      .input("contact_role", sql.VarChar, contact_role)
      .input("partita_iva", sql.VarChar, partita_iva)
      .input("pec", sql.VarChar, pec)
      .input("municipality", sql.VarChar, municipality)
      .input("province", sql.VarChar, province)
      .input("sdi_code", sql.VarChar, sdi_code)
      .input("zip_code", sql.VarChar, zip_code)
      .query(`
        INSERT INTO clients (
          address,
          ateco,
          billing_email,
          city,
          codice_fiscale,
          company_name,
          contact_email,
          contact_name,
          contact_phone,
          contact_role,
          partita_iva,
          pec,
          municipality,
          province,
          sdi_code,
          zip_code
        )
        VALUES (
          @address,
          @ateco,
          @billing_email,
          @city,
          @codice_fiscale,
          @company_name,
          @contact_email,
          @contact_name,
          @contact_phone,
          @contact_role,
          @partita_iva,
          @pec,
          @municipality,
          @province,
          @sdi_code,
          @zip_code
        )
      `);

    res.status(201).json({ message: "Client created successfully"});
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//GET all clients
router.get("/getClients", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
    .query(`SELECT 
      id, company_name, partita_iva, ateco, contact_name, contact_email, address 
      FROM clients`);

    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



//GET client by id
router.get("/getClient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT
            id,
            company_name, 
            address,
            municipality,
            zip_code,
            province,
            city,
            partita_iva,
            codice_fiscale,
            pec,
            sdi_code, 
            billing_email,
            contact_name,
            contact_email,
            contact_phone,
            contact_role
            FROM clients WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).send("Client not found");
    }

    res.json(result.recordset[0]);
    console.log('Fetched client by ID:', result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


//   console.log('Route called: getClientsContactName');

//   const { company_name } = req.query; // usa query string

//   if (!company_name) {
//     return res.status(400).json({ error: "Parametro 'company_name' mancante" });
//   }

//   try {
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input("company_name", sql.VarChar, company_name)
//       .query(`
//         SELECT contact_name
//         FROM clients
//         WHERE company_name = @company_name
//         AND contact_name IS NOT NULL
//       `);

//     res.status(200).json(result.recordset);
//     console.log('Query executed successfully:', result.recordset);
//   } catch (err) {
//     console.error("Error executing query:", err);
//     res.status(500).send("Server Error");
//   }
// });

//PUT: modify client by id
// manca possibilità di modificare il codice ateco
router.put("/modifyClient/:id", async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    address,
    municipality,
    zip_code,
    province,
    city,
    partita_iva,
    codice_fiscale,
    pec,
    sdi_code,
    billing_email,
    contact_name,
    contact_email,
    contact_phone,
    contact_role
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("address", sql.VarChar, address)
      .input("billing_email", sql.VarChar, billing_email)
      .input("city", sql.VarChar, city)
      .input("codice_fiscale", sql.VarChar, codice_fiscale)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_email", sql.VarChar, contact_email)
      .input("contact_name", sql.VarChar, contact_name)
      .input("contact_phone", sql.VarChar, contact_phone)
      .input("contact_role", sql.VarChar, contact_role)
      .input("partita_iva", sql.VarChar, partita_iva)
      .input("pec", sql.VarChar, pec)
      .input("municipality", sql.VarChar, municipality)
      .input("province", sql.VarChar, province)
      .input("sdi_code", sql.VarChar, sdi_code)
      .input("zip_code", sql.VarChar, zip_code)
      .query(`
        UPDATE clients
        SET
          address = @address,
          billing_email = @billing_email,
          city = @city,
          codice_fiscale = @codice_fiscale,
          company_name = @company_name,
          contact_email = @contact_email,
          contact_name = @contact_name,
          contact_phone = @contact_phone,
          contact_role = @contact_role,
          partita_iva = @partita_iva,
          pec = @pec,
          municipality = @municipality,
          province = @province,
          sdi_code = @sdi_code,
          zip_code = @zip_code
        WHERE id = @id
      `);

    res.status(200).json({ message: "Client updated successfully" });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;