const express = require("express");
const cors = require("cors");
const {poolPromise, sql} = require("../db/db");
const app = express();

const router = express.Router();

//UNICA POST PER CREARE ELEMENTO IN PIPE 
router.post('/newPipeProfile', async(req, res)=>{
const {first_name,
    last_name,
    birth_date,
    address,
    phone,
    email,
    soft_skills,
    hard_skills,
    english,
    job_title,
    seniority,
    has_vehicle,
    notes,
    data,
    protected_category,
    requested_ral,
    work_mode}= req.body;

    try{
        const pool = await poolPromise;
        await pool.request()
        .input('first_name', sql.VarChar, first_name)
        .input('last_name', sql.VarChar, last_name)
        .input('birth_date', sql.Date, birth_date)
        .input('address', sql.VarChar, address)
        .input('phone', sql.VarChar, phone)
        .input('email', sql.VarChar, email)
        .input('soft_skills', sql.TinyInt, soft_skills)
        .input('hard_skills', sql.TinyInt, hard_skills)
        .input('english', sql.TinyInt, english)
        .input('job_title', sql.VarChar, job_title)
        .input('seniority', sql.VarChar, seniority)
        .input('has_vehicle', sql.TinyInt, has_vehicle)
        .input('notes', sql.VarChar, notes)
        .input('data', sql.Date, data)
        .input('protected_category', sql.TinyInt, protected_category)
        .input('requested_ral', sql.Decimal, requested_ral)
        .input('work_mode', sql.VarChar, work_mode)
        .query(
            `INSERT INTO pipe_profile(
            first_name, 
            last_name, 
            birth_date, 
            address, 
            phone, 
            email, 
            soft_skills, 
            hard_skills, 
            english, 
            job_title, 
            seniority, 
            has_vehicle, 
            notes, 
            data, 
            protected_category, 
            requested_ral, 
            work_mode) 
            VALUES 
            (
            @first_name, 
            @last_name, 
            @birth_date, 
            @address, 
            @phone, 
            @email, 
            @soft_skills, 
            @hard_skills, 
            @english, 
            @job_title, 
            @seniority, 
            @has_vehicle, 
            @notes, 
            @data, 
            @protected_category, 
            @requested_ral, 
            @work_mode)`
        );
        res.status(201).json({message:"Pipe Profile created successfully!"});
    }catch(err){
        console.log("Error creating Pipe Profile:", err);
    res.status(500).json({error: "Internal Server Error"});
    }
});


//creazione nuova skill per employee

router.post('/addSkills/forEmployee/:id', async (req, res) => {
    const {id_pipe} = req.params
    const { skills, skills_valuation,area } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
        .input("id_pipe", sql.Int, id_pipe)
        .input("skills", sql.VarChar, skills)
        .input("skills_valuation", sql.TinyInt, skills_valuation)
        .input("area", sql.VarChar, area)
        .query(
            'INSERT INTO skills (id_pipe, skills, skills_valuation,area) VALUES (@id_pipe, @skills, @skills_valuation, @area)'
        );
        res.status(201).json({message: "Skills added successfully!"});    
    }catch(err){
        console.error("Error adding skills:", err);
        res.status(500).send("Server Error");
    }
});



module.exports = router;
