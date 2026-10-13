import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  MenuItem, 
  Alert 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// 1. Define your validation schema with Zod
const schema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  department: z.string(),
  message: z.string().optional(),
});

const departments = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'fullstack', label: 'Full Stack Development' },
];

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false);

  // 2. Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      department: 'frontend',
      message: ''
    }
  });

  // 3. Handle Form Submission
  const onSubmit = async (data) => {
    console.log("Validated Form Data:", data);

    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server Response:", result);
      setSubmitted(true);
      reset(); // Clear the form
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Developer Registration Form (Validated)
      </Typography>

      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Application submitted successfully and sent to the Node backend!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Full Name */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Full Name"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          {/* Department Dropdown */}
          <Grid item xs={12}>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Department / Role"
                >
                  {departments.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Short Bio / Notes"
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              endIcon={<SendIcon />}
              sx={{ textTransform: 'none', px: 4 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}