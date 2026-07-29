import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Grid,
} from "@mui/material";
import { LEAD_STATUSES } from "../utils/constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_LEAD = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "New",
  assignedTo: "",
  revenue: 0,
};

const LeadFormDialog = ({ open, onClose, onSubmit, initialData, submitting }) => {
  const [form, setForm] = useState(EMPTY_LEAD);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...EMPTY_LEAD, ...initialData } : EMPTY_LEAD);
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.company.trim()) errs.company = "Company is required";
    if (!form.assignedTo.trim()) errs.assignedTo = "Assigned To is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, revenue: Number(form.revenue) || 0 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Lead" : "Add New Lead"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                fullWidth
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                error={Boolean(errors.company)}
                helperText={errors.company}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {LEAD_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Assigned To"
                fullWidth
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                error={Boolean(errors.assignedTo)}
                helperText={errors.assignedTo}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Revenue (₹)"
                type="number"
                fullWidth
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {initialData ? "Save Changes" : "Add Lead"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadFormDialog;
