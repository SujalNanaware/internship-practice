const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(express.json());
app.use(cors());

// Helper function to read existing submissions from JSON file
const readSubmissions = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// 1. POST endpoint to receive and save form data
app.post('/api/submit', (req, res) => {
    const newSubmission = {
        id: Date.now(),
        ...req.body,
        submittedAt: new Date().toISOString()
    };

    const submissions = readSubmissions();
    submissions.push(newSubmission);
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));

    console.log("💾 Saved new submission to JSON file:", newSubmission);

    res.status(200).json({
        success: true,
        message: "Data saved successfully on the server!",
        data: newSubmission
    });
});

// 2. GET endpoint to retrieve all submissions for the dashboard
app.get('/api/submissions', (req, res) => {
    const submissions = readSubmissions();
    res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions
    });
});

// 3. DELETE endpoint to remove a submission by ID
app.delete('/api/submissions/:id', (req, res) => {
    const id = Number(req.params.id);
    let submissions = readSubmissions();
    const filteredSubmissions = submissions.filter(sub => sub.id !== id);

    if (submissions.length === filteredSubmissions.length) {
        return res.status(404).json({ success: false, message: "Submission not found" });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredSubmissions, null, 2));
    console.log(`🗑️ Deleted submission with ID: ${id}`);

    res.status(200).json({ success: true, message: "Submission deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});