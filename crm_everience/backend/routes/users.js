// Import necessary modules
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { poolPromise, sql } = require("../db/db");
const app = express();
const PORT = 3000;

//USERS
router.get("/getUsers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT u.id, 
                      u.username, 
                      u.first_name, 
                      u.last_name, 
                      u.uid, 
                      u.user_status, 
                      r.user_role_name 
                FROM users u 
                JOIN user_roles r 
                ON u.id_user_role = r.id`);
    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//get inactive users
router.get("/getDisabledUsers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT u.id, 
                      u.username, 
                      u.first_name, 
                      u.last_name, 
                      u.uid, 
                      u.user_status, 
                      r.user_role_name 
                FROM users u 
                JOIN user_roles r 
                ON u.id_user_role = r.id
                WHERE user_status = 0`);
    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//get active users
router.get("/getEnabledUsers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT u.id, 
                      u.username, 
                      u.first_name, 
                      u.last_name, 
                      u.uid, 
                      u.user_status, 
                      r.user_role_name 
                FROM users u 
                JOIN user_roles r 
                ON u.id_user_role = r.id
                WHERE user_status = 1`);
    res.json(result.recordset);
    console.log('executed', result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//get single user
router.get("/getUser/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT id, first_name, last_name
                FROM users 
                WHERE user.id = @id;
                `);
    res.json(result.recordset);
    console.log("executed", result.recordset)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// activate a user and set role
router.put("/activateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // role sent from frontend

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("role", sql.NVarChar(100), role)
      .query(`
        UPDATE users
        SET user_status = 1,
            id_user_role = (SELECT id FROM user_roles WHERE user_role_name = @role)
        WHERE id = @id
      `);

    res.status(200).json({ message: "User activated with role" });
  } catch (err) {
    console.error("Error activating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//deactivate an user
router.put("/deactivateUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE users
        SET
          user_status = 0
        WHERE id = @id
      `);

    res.status(200).json({ message: "User activated" });
  } catch (err) {
    console.error("Error activating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get service pret a mangers id= 5
router.get("/getServiceManagers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT id, id_user_role, first_name, last_name
                  FROM users 
                  WHERE id_user_role = 5
                  OR id_user_role = 2;`);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error")
  }
})

//get service manager by id
router.get("/getServiceManager/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT id, id_user_role, first_name, last_name
              FROM users 
              WHERE id_user_role = 5 AND id = @id;`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Service Manager not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post('/add-user-to-db', async (req, res) => {
  try {
    const { uid, username, first_name, last_name, id_user_role } = req.body;

    const pool = await poolPromise;
    // Insert user into your DB with user_status = 0
    const result = await pool.request()
      .input('id_user_role', 12)
      .input('username', username)
      .input('first_name', first_name)
      .input('last_name', last_name)
      .input('uid', uid)
      .input('user_status', 0)
      .query(`
        INSERT INTO users (id_user_role, username, first_name, last_name, uid, user_status)
        VALUES (@id_user_role, @username, @first_name, @last_name, @uid, @user_status);
      `);

    res.status(201).json({ message: 'User added to DB' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding user to DB' });
  }
});

router.get("/getUserRoles", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT id, user_role_name FROM user_roles ORDER BY user_role_name`);
    res.json(result.recordset);
    console.log("roles fetched:", result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



module.exports = router; 