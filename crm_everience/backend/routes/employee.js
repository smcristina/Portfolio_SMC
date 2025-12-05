const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("../db/db");
const router = express.Router();
const app = express();
const PORT = 3000;


//DA AGGIUNGERE IL RIFERIMENTO A ID CLIENT E ID PNL SE ESISTONO
//crea nuovo Dipendente POST /api/newEmployee
router.post('/newEmployee', async (req, res) => {
    const { 
        first_name,
        last_name,
        personal_email,
        phone,
        cost,
        birth_date,
        birth_place,
        codice_fiscale,
        years_of_experience,
        seniority,
        domicile_address,
        residence_address,
        domicile_province,
        residence_province,
        domicile_zip_code,
        residence_zip_code,
        client,
        notes,
        has_vehicle,
        has_driver_license,
        availability,
        cm_employee,
        final_client,
        communication_skills,
        autonomy,
        standing } = req.body;
    try {
        const pool = await poolPromise;

        await pool.request()
            .input("first_name", sql.VarChar, first_name)
            .input("last_name", sql.VarChar, last_name)
            .input("personal_email", sql.VarChar, personal_email)
            .input("phone", sql.VarChar, phone)
            .input("cost", sql.Decimal, cost)
            .input("birth_date", sql.Date, birth_date)
            .input("birth_place", sql.VarChar, birth_place)
            .input("codice_fiscale", sql.VarChar, codice_fiscale)
            .input("years_of_experience", sql.Int, years_of_experience)
            .input("seniority", sql.VarChar, seniority)
            .input("domicile_address", sql.VarChar, domicile_address)
            .input("residence_address", sql.VarChar, residence_address)
            .input("domicile_province", sql.VarChar, domicile_province)
            .input("residence_province", sql.VarChar, residence_province)
            .input("domicile_zip_code", sql.VarChar, domicile_zip_code)
            .input("residence_zip_code", sql.VarChar, residence_zip_code)
            .input("client", sql.VarChar, client)
            .input("notes", sql.VarChar, notes)
            .input("has_vehicle", sql.TinyInt, has_vehicle)
            .input("has_driver_license", sql.TinyInt, has_driver_license)
            .input("availability", sql.TinyInt, availability)
            .input("cm_employee", sql.VarChar, cm_employee)
            .input("final_client", sql.VarChar, final_client)
            .input("communication_skills", sql.TinyInt, communication_skills)
            .input("autonomy", sql.TinyInt, autonomy)
            .input("standing", sql.TinyInt, standing)
            .query(`
            INSERT INTO employees (
                first_name,
                last_name,
                personal_email,
                phone,
                cost,
                birth_date,
                birth_place,
                codice_fiscale,
                years_of_experience,
                seniority,
                domicile_address,
                residence_address,
                domicile_province,
                residence_province,
                domicile_zip_code,
                residence_zip_code,
                client,
                notes,
                has_vehicle,
                has_driver_license,
                availability,
                cm_employee,
                final_client,
                communication_skills,
                autonomy,
                standing
            ) VALUES (
                @first_name,
                @last_name,
                @personal_email,
                @phone, 
                @cost,
                @birth_date,
                @birth_place,
                @codice_fiscale,
                @years_of_experience,
                @seniority,
                @domicile_address,
                @residence_address,
                @domicile_province,
                @residence_province,
                @domicile_zip_code,
                @residence_zip_code,
                @client,
                @notes,
                @has_vehicle,
                @has_driver_license,
                @availability,  
                @cm_employee,
                @final_client,
                @communication_skills,
                @autonomy,
                @standing
            )
    `);
    
        return res.status(201).json({
            message: "New employee created successfully"
        });
    } catch (err) {
        console.error("Error creating new employee:", err);
        res.status(500).send("Server Error");
    }
});

//aggiungi skills
router.post('/addSkillsForEmployee/:id_employee', async (req, res) => {
    const { id_employee } = req.params;
    const { area, skills, skills_valuation } = req.body;
    try {
        const pool = await poolPromise;
        
        await pool.request()
            .input("id_employee", sql.Int, id_employee)
            .input("area", sql.VarChar, area)
            .input("skills", sql.VarChar, skills)
            .input("skills_valuation", sql.VarChar, skills_valuation)
            .query(`
            INSERT INTO skills (id_employee, area, skills, skills_valuation)
            VALUES (@id_employee, @area, @skills, @skills_valuation)
        `);
        return res.status(201).json({ message: "Skills added successfully" });
    } catch (err) {
        console.error("Error adding skills:", err);
        res.status(500).send("Server Error");
    }
});



//visualizza l'insieme di dipendenti  GET  /api/getEmployees
router.get("/getEmployees", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT
            e.id,
            e.first_name,
            e.last_name, 
            e.seniority, 
            e.residence_province, 
            e.client,
            e.final_client,      
            e.cost, 
            e.availability,
            o.start_date,
            o.end_date
        FROM employees e
        LEFT JOIN Employee_contracts o on e.id = o.id_employee
        `);
        res.json(result.recordset);
        console.log('executed', result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

//visualiza il singolo dipendente GET  /api/getEmployee/:id
// router.get("/getEmployee/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input("id", sql.Int, id)
//             .query(`
//                 SELECT
//                 e.id, 
//                 e.first_name,
//                 e.last_name,
//                 e.personal_email,
//                 e.phone,
//                 e.cost,
//                 e.birth_date,
//                 e.birth_place,
//                 e.codice_fiscale,
//                 e.years_of_experience,
//                 e.seniority,
//                 e.domicile_address,
//                 e.residence_address,
//                 e.domicile_province,
//                 e.residence_province,
//                 e.domicile_zip_code,
//                 e.residence_zip_code,
//                 e.client,
//                 e.notes,
//                 e.has_vehicle,
//                 e.has_driver_license,
//                 e.availability,
//                 e.cm_employee,
//                 e.final_client,
//                 e.communication_skills,
//                 e.autonomy,
//                 e.standing, 
//                 s.id_employee,
//                 s.skills,
//                 s.skills_valuation,
//                 s.area,
//                 s.english,
//                 c.id_employee,
//                 c.start_date,
//                 c.end_date

//             FROM employees e 
//             JOIN skills s ON e.id = s.id_employee
//             LEFT JOIN employee_contracts c ON e.id = c.id_employee

//                 WHERE e.id = @id
//                 AND  s.id_employee = @id
//         `);

//         if (result.recordset.length === 0) {
//       return res.status(404).send("Skills not found");
//     }

//         res.json(result.recordset[0]);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// });

router.get("/getEmployee/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;

        // Prima query: dati dell'employee
        const employeeResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                e.id, 
                e.first_name,
                e.last_name,
                e.personal_email,
                e.phone,
                e.cost,
                e.birth_date,
                e.birth_place,
                e.codice_fiscale,
                e.years_of_experience,
                e.seniority,
                e.domicile_address,
                e.residence_address,
                e.domicile_province,
                e.residence_province,
                e.domicile_zip_code,
                e.residence_zip_code,
                e.client,
                e.notes,
                e.has_vehicle,
                e.has_driver_license,
                e.availability,
                e.cm_employee,
                e.final_client,
                e.communication_skills,
                e.autonomy,
                e.standing
                FROM employees e 
                WHERE e.id = @id
            `);

        if (employeeResult.recordset.length === 0) {
            return res.status(404).send("Employee not found");
        }

        // Seconda query: skills dell'employee
        const skillsResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                skills,
                skills_valuation,
                area
                area
                FROM skills
                WHERE id_employee = @id
            `);

        // Terza query: contratti dell'employee
        const contractsResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT
                start_date,
                end_date
                FROM employee_contracts
                WHERE id_employee = @id
            `);

        // Combina i risultati
        const response = {
            ...employeeResult.recordset[0],
            skills: skillsResult.recordset,
            contracts: contractsResult.recordset
        };

        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


//GET SKILLS
    // router.get('/getSkills', )
router.get('/getSkills/:id_employee', async(req,res) => {
    const {id_employee} = req.params;
    
    try{
        const pool = await poolPromise;
        const result = await pool.request()
        .input("id_employee", sql.Int, id_employee)
        .query(`select *
            from skills
            where id_employee = @id_employee`);

            res.json(result.recordset);
            console.log('executed', result.recordset);
    }catch (err){
        console.error("errore nella getSkills",err);
    }

});


// modifica dett. dipendente PUT /api/modifyEmployee/:id
router.put('/modifyEmployee/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name,
        last_name,
        personal_email,
        phone,
        cost,
        birth_date,
        birth_place,
        codice_fiscale,
        years_of_experience,
        seniority,
        domicile_address,
        residence_address,
        domicile_province,
        residence_province,
        domicile_zip_code,
        residence_zip_code,
        client,
        notes,
        has_vehicle,
        has_driver_license,
        availability,
        cm_employee,
        final_client,
        communication_skills,
        autonomy,
        standing } = req.body;
    try {
        const pool = await poolPromise;
        const request = await pool.request()
            .input("id", sql.Int, id)
            .input("first_name", sql.VarChar, first_name)
            .input("last_name", sql.VarChar, last_name)
            .input("personal_email", sql.VarChar, personal_email)
            .input("phone", sql.VarChar, phone)
            .input("cost", sql.Decimal, cost)
            .input("birth_date", sql.Date, birth_date)
            .input("birth_place", sql.VarChar, birth_place)
            .input("codice_fiscale", sql.VarChar, codice_fiscale)
            .input("years_of_experience", sql.Int, years_of_experience)
            .input("seniority", sql.VarChar, seniority)
            .input("domicile_address", sql.VarChar, domicile_address)
            .input("residence_address", sql.VarChar, residence_address)
            .input("domicile_province", sql.VarChar, domicile_province)
            .input("residence_province", sql.VarChar, residence_province)
            .input("domicile_zip_code", sql.VarChar, domicile_zip_code)
            .input("residence_zip_code", sql.VarChar, residence_zip_code)
            .input("client", sql.VarChar, client)
            .input("notes", sql.VarChar, notes)
            .input("has_vehicle", sql.TinyInt, has_vehicle)
            .input("has_driver_license", sql.TinyInt, has_driver_license)
            .input("availability", sql.TinyInt, availability)
            .input("cm_employee", sql.VarChar, cm_employee)
            .input("final_client", sql.VarChar, final_client)
            .input("communication_skills", sql.TinyInt, communication_skills)
            .input("autonomy", sql.TinyInt, autonomy)
            .input("standing", sql.TinyInt, standing)

            .query(`
        UPDATE employees 
        SET first_name = @first_name,
            last_name = @last_name,
            personal_email = @personal_email,
            phone = @phone,
            cost = @cost,
            birth_date = @birth_date,
            birth_place = @birth_place,
            codice_fiscale = @codice_fiscale,
            years_of_experience = @years_of_experience,
            seniority = @seniority,
            domicile_address = @domicile_address,
            residence_address = @residence_address,
            domicile_province = @domicile_province,
            residence_province = @residence_province,
            domicile_zip_code = @domicile_zip_code,
            residence_zip_code = @residence_zip_code,
            client = @client,
            notes = @notes,
            has_vehicle = @has_vehicle,
            has_driver_license = @has_driver_license,
            availability = @availability,
            cm_employee = @cm_employee,
            final_client = @final_client,
            communication_skills = @communication_skills,
            autonomy = @autonomy,
            standing = @standing
            WHERE id = @id
            `);
        res.json(request.recordset, {message: "Employee modified successfully"});

        res.json(result.recordset);

    } catch (err) {
        console.error("Error modifying employee:", err);
        res.status(500).send("Server Error");
    }
});


//modifica skills per emloyee
router.put('/modifySkillsForEmployee/:id', async (req, res) => {
    const { id_employee } = req.params;
    const { skills, skills_valuation, area } = req.body;
    try {
        const pool = await poolPromise;
        const request = await pool.request()
        request
            .input("id_employee", sql.Int, id_employee)
            .input("skills", sql.VarChar, skills)
            .input("skills_valuation", sql.VarChar, skills_valuation)
            .input("area", sql.VarChar, area)
            .query(`
            UPDATE skills
            SET skills = @skills,
                skills_valuation = @skills_valuation, 
                area = @area, 

                WHERE id_employee = @id_employee
            `);
        res.json({ message: "Skills modified successfully" });
    } catch (err) {
        console.error("Error modifying skills:", err);
        res.status(500).send("Server Error");
    }

});

//elimina dipendente  DELETE /api/deleteEployee
//FORSE NON SERVE, PERCHè DOBBIAMO TOGLIERLA COME OPZIONE
router.delete('/deleteEmployee/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM employees
            WHERE id = @id
        `);
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).send("Server Error");
    }
});


//EFFETTIVAMENTE SERVE QUESTO METODO??
// ||

//elimina skills per employee DELETE /api/deleteSkills/forEmployee/:id
router.delete('/deleteSkillsForEmployee/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .query(`
            DELETE FROM skills
            WHERE id_employee = @id
        `);
        res.json({ message: "Skills deleted successfully" });
    } catch (err) {
        console.error("Error deleting skills:", err);
        res.status(500).send("Server Error");
    }
});


module.exports = router;