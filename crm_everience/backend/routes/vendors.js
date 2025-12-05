const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("../db/db");
const Excel = require('xlsx-populate');
const router = express.Router();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//crea nuovo venodr  
//  post /api/newVendor

// da aggiungere creazione di un vendor con cm_vendor dentificatore univoco composto:
//-'F' + numero autoincrementale F0007, F0015 
router.post('/newVendor', async (req, res) => {
    const { vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale } = req.body

    try {
        const pool = await poolPromise;

        // 1. Recupera il valore più alto di cm_vendor esistente
        const maxResult = await pool.request()
            .query(`SELECT MAX(CAST(SUBSTRING(cm_vendor, 2, LEN(cm_vendor)-1) AS INT)) as max_number 
                    FROM vendors 
                    WHERE cm_vendor LIKE 'F%' AND LEN(cm_vendor) >= 2`);

        // 2. Calcola il prossimo numero incrementale
        const maxNumber = maxResult.recordset[0].max_number || 0;
        const nextNumber = maxNumber + 1;

        // 3. Genera il nuovo cm_vendor con formato F + numero con padding di zeri
        const cm_vendor = 'F' + nextNumber.toString().padStart(4, '0');

        // 4. Inserisci il nuovo vendor con il cm_vendor generato
        await pool.request()
            .input("vendor_name", sql.VarChar, vendor_name)
            .input("province", sql.VarChar, province)
            .input("service_category", sql.VarChar, service_category)
            .input("standard_daily_cost", sql.Decimal, standard_daily_cost)
            .input("maggiorazione_non_feriale", sql.VarChar, maggiorazione_non_feriale)
            .input("cm_vendor", sql.VarChar, cm_vendor)
            .query('INSERT INTO vendors (vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale, cm_vendor) VALUES (@vendor_name, @province, @service_category, @standard_daily_cost, @maggiorazione_non_feriale, @cm_vendor)');

        // Risposta di successo
        res.status(201).json({
            message: "New vendor created successfully",
            cm_vendor: cm_vendor
        });
    } catch (err) {
        console.error("Error creating new vendor:", err);
        res.status(500).send("Server Error");
    }
});

//restituisci singolo vendor GET /api/getVendor/:id
router.get("/getVendor/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale FROM vendors WHERE id = @id");
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send("Vendor not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

//restituisci tutti i vendor  GET /api/getVendors

router.get("/getVendors", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .query('SELECT vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale  FROM vendors');

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

/*  NOTA PER FARLO FUNZIONARE DEVI INSTALLARE LA LIBRERIA NELLA CATELLA DEL PROGETTO BACKEND
    npm install xlsx-populate
*/

//estrazione in excel o pdf (non ricordo) della lista di vendors  GET /api/extractVendors
// Estrazione in Excel della lista di vendors GET /api/extractVendors
/*router.get("/extractVendors", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale FROM vendors');

        // Crea un nuovo workbook
        const workbook = await Excel.fromBlankAsync();
        const sheet = workbook.sheet(0);

        // Intestazioni
        const headers = ["Vendor Name", "Province", "Service Category", "Standard Daily Cost", "Maggiorazione Non Feriale"];
        headers.forEach((header, idx) => {
            sheet.cell(1, idx + 1).value(header);
        });

        // Dati
        result.recordset.forEach((vendor, rowIdx) => {
            sheet.cell(rowIdx + 2, 1).value(vendor.vendor_name);
            sheet.cell(rowIdx + 2, 2).value(vendor.province);
            sheet.cell(rowIdx + 2, 3).value(vendor.service_category);
            sheet.cell(rowIdx + 2, 4).value(vendor.standard_daily_cost);
            sheet.cell(rowIdx + 2, 5).value(vendor.maggiorazione_non_feriale);
        });

        // Genera il file Excel in memoria e invialo come risposta
        const buffer = await workbook.outputAsync();
        res.setHeader('Content-Disposition', 'attachment; filename="vendors.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
*/

//modifica Vendor  PUT /api/modifyVendor/:id

router.post('/modifyVendor/:id', async (req, res) => {
    const { id } = req.params;
    const { vendor_name, province, service_category, standard_daily_cost, maggiorazione_non_feriale, cm_vendor } = req.body;
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        request
            .input("vendor_name", sql.VarChar, vendor_name)
            .input("province", sql.VarChar, province)
            .input("service_category", sql.VarChar, service_category)
            .input("standard_daily_cost", sql.Decimal, standard_daily_cost)
            .input("maggiorazione_non_feriale", sql.VarChar, maggiorazione_non_feriale)
            .input("cm_vendor", sql.VarChar, cm_vendor)
            .input("id", sql.Int, id);

        await request.query(
            `UPDATE vendors SET 
                vendor_name = @vendor_name, 
                province = @province, 
                service_category = @service_category, 
                standard_daily_cost = @standard_daily_cost, 
                maggiorazione_non_feriale = @maggiorazione_non_feriale, 
                cm_vendor = @cm_vendor 
            WHERE id = @id`
        );

        res.status(200).json({ message: "Vendor updated successfully" });
    } catch (err) {
        console.error("Error modifying vendor:", err);
        res.status(500).send("Server Error");
    }
});

//archivia vendor  
router.put('/archiveVendor/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .query("UPDATE vendors SET archived = 1 WHERE id = @id");
        res.json({ message: "Vendor archived successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;