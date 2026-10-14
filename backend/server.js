const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT,
            email TEXT,
            department TEXT,
            message TEXT,
            submittedAt TEXT
        )`, () => {
            console.log('📋 SQL Table "submissions" is ready.');
        });
    }
});

// 1. GET endpoint: Retrieve all submissions
app.get('/api/submissions', (req, res) => {
    const query = `SELECT * FROM submissions ORDER BY id DESC`;
    console.log(`\n🔍 Executing SQL Query: ${query}`);
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        console.log(`📊 Fetched ${rows.length} rows from database.`);
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
});

// 2. POST endpoint: Insert a new submission
app.post('/api/submit', (req, res) => {
    const { fullName, email, department, message } = req.body;
    const submittedAt = new Date().toISOString();

    const query = `INSERT INTO submissions (fullName, email, department, message, submittedAt) VALUES (?, ?, ?, ?, ?)`;
    const params = [fullName, email, department, message, submittedAt];
    
    console.log(`\n✍️ Executing SQL Query: ${query}`);
    console.log(`📦 With Values:`, params);

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        const newSubmission = {
            id: this.lastID,
            fullName,
            email,
            department,
            message,
            submittedAt
        };

        console.log(`✅ SQL Insert Successful! New Row ID: ${this.lastID}`);
        res.status(200).json({
            success: true,
            message: "Data saved successfully to SQLite!",
            data: newSubmission
        });
    });
});

// 3. PUT endpoint: Update a submission
app.put('/api/submissions/:id', (req, res) => {
    const { id } = req.params;
    const { fullName, email, department, message } = req.body;

    const query = `UPDATE submissions SET fullName = ?, email = ?, department = ?, message = ? WHERE id = ?`;
    const params = [fullName, email, department, message, id];

    console.log(`\n✏️ Executing SQL Query: ${query}`);
    console.log(`📦 With Values:`, params);

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        console.log(`✅ SQL Update Successful! Rows affected: ${this.changes}`);
        res.status(200).json({ 
            success: true, 
            message: "Submission updated successfully", 
            data: { id: Number(id), fullName, email, department, message } 
        });
    });
});

// 4. DELETE endpoint: Delete a submission
app.delete('/api/submissions/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM submissions WHERE id = ?`;
    console.log(`\n🗑️ Executing SQL Query: ${query} [ID: ${id}]`);

    db.run(query, id, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        console.log(`✅ SQL Delete Successful! Rows deleted: ${this.changes}`);
        res.status(200).json({ success: true, message: "Submission deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});