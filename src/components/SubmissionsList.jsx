import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField,
  IconButton,
  Skeleton,
  Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch submissions from Node.js backend
  const fetchSubmissions = () => {
    fetch('http://localhost:5000/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubmissions(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions from the server.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle Deleting a Submission
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/submissions/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        // Remove item from local state immediately
        setSubmissions(submissions.filter((sub) => sub.id !== id));
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
    }
  };

  // Filter submissions based on search input
  const filteredSubmissions = submissions.filter((sub) => 
    sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Submitted Applications Dashboard 📊
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search by name or email..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Submitted At</TableCell>
              <TableCell sx={{ fontWeight: 'bold', align: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading Skeletons
              [...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="circular" width={30} height={30} /></TableCell>
                </TableRow>
              ))
            ) : filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No submissions found. Try filling out the form or clearing your search!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.fullName}</TableCell>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{sub.department}</TableCell>
                  <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(sub.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}