import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableSortLabel,
  Chip,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import {
  fetchLeads,
  fetchStats,
  createLead,
  updateLead,
  deleteLead,
  setQueryParams,
} from "../features/leads/leadsSlice";
import { LEAD_STATUSES, getStatusColor } from "../utils/constants";
import LeadFormDialog from "../components/LeadFormDialog";
import { exportLeadsToCsv } from "../utils/exportCsv";

let debounceTimer;

const Leads = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isSmall = useMediaQuery("(max-width:800px)");

  const { items, total, pages, queryParams, status, mutationStatus } = useSelector(
    (state) => state.leads
  );

  const [searchInput, setSearchInput] = useState(queryParams.search);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadLeads = useCallback(() => {
    dispatch(fetchLeads(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dispatch(setQueryParams({ search: value, page: 1 }));
    }, 400);
  };

  const handleStatusFilter = (value) => {
    dispatch(setQueryParams({ status: value, page: 1 }));
  };

  const handleSort = (field) => {
    const isSameField = queryParams.sortBy === field;
    const nextOrder = isSameField && queryParams.order === "asc" ? "desc" : "asc";
    dispatch(setQueryParams({ sortBy: field, order: nextOrder }));
  };

  const handlePageChange = (_, value) => {
    dispatch(setQueryParams({ page: value }));
  };

  const openAddDialog = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const openEditDialog = (lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingLead) {
      await dispatch(updateLead({ id: editingLead._id, leadData: data }));
    } else {
      await dispatch(createLead(data));
    }
    setFormOpen(false);
    loadLeads();
    dispatch(fetchStats());
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteLead(deleteTarget._id));
      dispatch(fetchStats());
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    exportLeadsToCsv(items, `leads-page-${queryParams.page}.csv`);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5">Leads</Typography>
          <Typography variant="body2" color="text.secondary">
            {total} total lead{total === 1 ? "" : "s"} in your pipeline
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            onClick={handleExport}
            disabled={items.length === 0}
          >
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
            Add Lead
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Search by name, email, company..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            value={queryParams.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 200 } }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {isSmall ? (
        <Stack spacing={1.5}>
          {items.map((lead) => (
            <Card key={lead._id} elevation={0}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1">{lead.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={lead.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(lead.status, mode),
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Stack spacing={0.3} sx={{ mt: 1.5 }}>
                  <Typography variant="body2">{lead.email}</Typography>
                  <Typography variant="body2">{lead.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned to {lead.assignedTo}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEditDialog(lead)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => setDeleteTarget(lead)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && status !== "loading" && (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No leads match your filters.
            </Typography>
          )}
        </Stack>
      ) : (
        <Paper elevation={0} sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={queryParams.sortBy === "name"}
                      direction={queryParams.sortBy === "name" ? queryParams.order : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={queryParams.sortBy === "company"}
                      direction={queryParams.sortBy === "company" ? queryParams.order : "asc"}
                      onClick={() => handleSort("company")}
                    >
                      Company
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={queryParams.sortBy === "status"}
                      direction={queryParams.sortBy === "status" ? queryParams.order : "asc"}
                      onClick={() => handleSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(lead.status, mode),
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditDialog(lead)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(lead)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && status !== "loading" && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No leads match your filters.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={pages}
            page={queryParams.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}

      <LeadFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLead}
        submitting={mutationStatus === "loading"}
      />

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete lead?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;
