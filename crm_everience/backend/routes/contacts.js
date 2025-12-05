// Import necessary modules
const express = require("express");
const cors = require("cors");
const router = express.Router();

const { poolPromise, sql } = require("../db/db");

const app = express();
const PORT = 3000;


//CREATE NEW CONTACT 
router.post('/newContact', async(req, res)=> {
  const{contact_name,contact_role,contact_phone,contact_mail,contact_source,company_name} = req.body;
  
  try{
    const pool = await poolPromise;
    await pool.request()
      .input("contact_name", sql.VarChar, contact_name)
      .input("contact_role", sql.VarChar, contact_role)
      .input("contact_phone", sql.VarChar, contact_phone)
      .input("contact_mail", sql.VarChar, contact_mail)
      .input("contact_source", sql.VarChar, contact_source)
      .input("company_name", sql.VarChar, company_name)
      .query(`
        INSERT INTO contacts( 
        contact_name, 
        contact_role, 
        contact_phone, 
        contact_mail, 
        contact_source, 
        company_name,
        archived
        ) 
        VALUES (
        @contact_name, 
        @contact_role, 
        @contact_phone, 
        @contact_mail, 
        @contact_source, 
        @company_name,
        0
        )`
      );
    res.status(201).json({
      message: "New contact created successfully" });
  }catch(err){
    console.error("Error creating new contact:", err);
    res.status(500).send("Server Error");
  }
})

//RETURN ALL CONTACTS
router.get("/getContacts", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM contacts where archived = 0");
    res.json(result.recordset);
    console.log('executed', result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


//RETURN ONLY ONE CONTACT BY ID
router.get("/getContact/:id", async (req, res)=>{
  const{id}= req.params;
    try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT contact_name,
        contact_mail,
        contact_phone,
        contact_role,
        contact_source,
        company_name 
        FROM contacts WHERE id = @id`);
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }  
});

//get contact_name
 router.get('/getContactsName', async (req, res) =>{
  const {company_name} = req.query;
  try{
    const pool = await poolPromise;
    const result = await pool.request()
    .input("company_name", sql.VarChar, company_name)
    .query(`SELECT contact_name
            FROM contacts
            WHERE company_name = @company_name`);
      
      res.status(200).json(result.recordset);
      console.log("contact name trovato correttamente", result.recordset);
    
  }catch(err){
      console.error("non è stato trovato il contact name", err);
      res.status(500).send("errore nel getContactName");
  }
 })

//modificica
router.put('/modifyContact/:id', async (req, res) => {
  const { id } = req.params;
  const { contact_name, contact_role, contact_phone, contact_mail, contact_source, company_name } = req.body;
  try {
    const pool = await poolPromise;
    const request = await pool.request();
    await request
      .input("id", sql.Int, id)
      .input("contact_name", sql.VarChar, contact_name)
      .input("contact_role", sql.VarChar, contact_role)
      .input("contact_phone", sql.VarChar, contact_phone)
      .input("contact_mail", sql.VarChar, contact_mail)
      .input("contact_source", sql.VarChar, contact_source)
      .input("company_name", sql.VarChar, company_name)
      .query(`
        Update contacts 
        SET contact_name = @contact_name,
            contact_role = @contact_role,
            contact_phone = @contact_phone,
            contact_mail = @contact_mail,
            contact_source = @contact_source,
            company_name = @company_name
        WHERE id = @id
      `);
    res.json({ message: "Contact updated successfully" });  
  
  }catch(err){
    console.error("Error updating contact:", err);  
    res.status(500).send("Server Error"); 
  }
    });

    
//archived
router.put('/archivedContact/:id', async (req, res) => {
  const{id} = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE contacts SET archived = 1 WHERE id = @id");
    res.json({ message: "Contact archived successfully" });
  } catch (err) {
    console.error("Error archiving contact:", err);
    res.status(500).send("Server Error");
  }
});

//get archived contacts
router.get("/getContacts", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM contacts where archived = 0");
    res.json(result.recordset);
    console.log('executed', result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;