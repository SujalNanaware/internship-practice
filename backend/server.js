const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(express.json());
app.use(cors());

// Helper function to read existing submissions
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

    // Read current submissions, push the new one, and write back to file
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

// 2. GET endpoint to retrieve all submissions (we'll use this next for a dashboard!)
app.get('/api/submissions', (req, res) => {
    const submissions = readSubmissions();
    res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});