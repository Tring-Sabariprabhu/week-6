const db = require('./Db.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.listen(port,()=>{
    console.log(`Server is running on 'PORT' ${port}`);
})

app.get('/', (req,res)=>{
    res.send("Hello World (GET)");
});

app.post('/', (req,res)=>{
    res.send("Hello World (POST)");
});

app.get('/doctors', async (req,res)=>{
    try {
        const result = await db.query("SELECT * FROM doctors");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", message: err.message });
    }
});

app.get('/patients', async (req,res)=>{
    try {
        const result = await db.query("SELECT * FROM patients");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Database error", message: err.message });
    }
});

app.get('/appointments', async (req,res)=>{
    try {
        const result = await db.query("SELECT a.appointment_id, a.disease, p.patient_id, p.patient_name, p.patient_age, d.doctor_id, d.doctor_name, d.specialization  FROM appointments a INNER JOIN patients p ON a.patient_id = p.patient_id INNER JOIN doctors d ON a.doctor_id = d.doctor_id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", message: err.message });
    }
});

app.get('/appointments/:id', async (req,res)=>{
    try {
        const {params} = req;
        const id = parseInt(params.id);
        const result = await db.query(`SELECT a.appointment_id, a.disease, p.patient_id, p.patient_name, p.patient_age, d.doctor_id, d.doctor_name, d.specialization  FROM appointments a INNER JOIN patients p ON a.patient_id = p.patient_id INNER JOIN doctors d ON a.doctor_id = d.doctor_id  WHERE appointment_id = ${id} `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", message: err.message });
    }
});
app.post('/insertDoctor', async (req, res)=>{
    try{
        const {doctor_name, specialization} = req.body;
        await db.query("INSERT INTO doctors(doctor_name, specialization) VALUES($1, $2)", [doctor_name, specialization]);
        res.send("Inserted Successfully");
    }
    catch(err){
        res.send("Insertion failed" , err);
    }
})

app.put('/updateDoctor/:doctor_id', async (req, res)=>{
    try{
        const doctor_id = parseInt(req.params.doctor_id);
        const { doctor_name } = req.body;
        await db.query(`UPDATE doctors SET doctor_name = $1 WHERE doctor_id = $2` ,[doctor_name, doctor_id]);
        res.send("Updation Successfully");
    }
    catch(err){
        res.send("Updation failed", err);
    }
})

app.delete('/deleteDoctor/:doctor_id' , async (req, res)=>{
    try{
        const doctor_id = parseInt(req.params.doctor_id);
        await db.query(`DELETE FROM doctors WHERE doctor_id = ${doctor_id}`);
        res.send("Deletion Successfully");
    }
    catch(err){
        res.send("Deletion failed", err);
    }
})