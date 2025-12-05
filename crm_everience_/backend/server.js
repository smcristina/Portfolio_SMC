const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// percorso routes
const contactRoutes = require('./routes/contacts');

//const clientContractsRoutes = require('./routes/client_contracts');
const clientContractsRoutes = require('./routes/client_contracts');

const clientRoutes = require('./routes/clients');

const employeeRoutes = require('./routes/employee');

const leadRoutes = require('./routes/leads');

const opportunitiesRoutes = require('./routes/opportunities');

const requestsRoutes = require('./routes/requests');

// const clientContractsRoutes = require('./routes/client_contracts');

const pipeProfileRoutes = require('./routes/pipe_profile');

const vendorsRoutes = require('./routes/vendors');

//const skillsRoutes = require('./routes/skills');

const usersRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());




/***********Good Practice Rules:***************
 * Always use DESCRIPTIVE names, in ENGLISH, with camelCase
 * 
 * GET methods
 * GET ALL   ---> getLeads
 * GET ONE   ---> getLead:id
 * 
 * PUT methods
 * UPDATE    ---> updateLead / modifyLead
 * 
 * POST methods
 * CREATE    ---> createNewLead / createLead 
 * 
 * DELETE methods
 * DELETE ALL  ---> deleteAllLeadsWithXCondition
 * DELETE ONE  ---> deleteLead:id
 ***********************************************/


//richiamo routes 
app.use("/api/contacts", contactRoutes);

app.use("/api/client_contracts", clientContractsRoutes);

app.use("/api/clients", clientRoutes);

app.use("/api/employee", employeeRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/opportunities", opportunitiesRoutes);

app.use("/api/pipe_profile", pipeProfileRoutes);

app.use("/api/requests", requestsRoutes);

app.use("/api/vendors", vendorsRoutes);

//app.use("/api/skills", skillsRoutes);

app.use("/api/users", usersRoutes);

//AVVIO SERVER   app.use();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



