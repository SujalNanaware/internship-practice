import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, TextField, IconButton, 
  Skeleton, Alert, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Edit Modal State
  const [editingSub, setEditingSub] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchSubmissions = () => {
    fetch('http://localhost:5000/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSubmissions(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load submissions.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchSubmissions(); }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/submissions/${id}`, { method: 'DELETE' });
    setSubmissions(submissions.filter((sub) => sub.id !== id));
  };

  // Open Edit Modal
  const handleEditClick = (sub) => {
    setEditingSub(sub);
    setOpenModal(true);
  };

  // Save Edited Submission
  const handleUpdateSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/submissions/${editingSub.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingSub),
    });
    const result = await res.json();
    if (result.success) {
      setSubmissions(submissions.map(sub => sub.id === editingSub.id ? result.data : sub));
      setOpenModal(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID,Full Name,Email,Department,Submitted At\n"];
    const rows = submissions.map(s => `${s.id},"${s.fullName}","${s.email}",${s.department},"${s.submittedAt}"`);
    const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
  };

  // Department Chip Color Helper
  const getChipColor = (dept) => {
    if (dept === 'frontend') return 'primary';
    if (dept === 'backend') return 'success';
    return 'secondary';
  };

  const filteredSubmissions = submissions.filter((sub) => 
    sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard 📊
        </Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToCSV} sx={{ textTransform: 'none' }}>
          Export CSV
        </Button>
      </Box>

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
          <TableHead sx={{ bgcolor: 'action.hover' }}>
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
              [...Array(3)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton variant="text" /></TableCell></TableRow>
              ))
            ) : filteredSubmissions.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center"><Typography sx={{ py: 3 }}>No submissions found.</Typography></TableCell></TableRow>
            ) : (
              filteredSubmissions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.fullName}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                      <Chip label={sub.department} color={getChipColor(sub.department)} size="small" />
                    </TableCell>
                    <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditClick(sub)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(sub.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredSubmissions.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Edit Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Edit Submission</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
          <TextField 
            label="Full Name" 
            value={editingSub?.fullName || ''} 
            onChange={(e) => setEditingSub({...editingSub, fullName: e.target.value})} 
          />
          <TextField 
            label="Email" 
            value={editingSub?.email || ''} 
            onChange={(e) => setEditingSub({...editingSub, email: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateSubmit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}