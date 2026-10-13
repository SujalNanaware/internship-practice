import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormPage from './components/FormPage';
import SubmissionsList from './components/SubmissionsList';
import { Container, Box } from '@mui/material';

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 6 }}>
        <Navbar />
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/submissions" element={<SubmissionsList />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}