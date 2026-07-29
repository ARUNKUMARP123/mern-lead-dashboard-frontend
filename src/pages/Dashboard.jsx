import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Typography, Paper, useTheme } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchStats } from "../features/leads/leadsSlice";
import KpiCard from "../components/KpiCard";
import { getStatusColor } from "../utils/constants";

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { stats, statsStatus } = useSelector((state) => state.leads);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const revenueFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(stats.revenue || 0);

  const barData = (stats.statusBreakdown || []).map((s) => ({
    status: s._id,
    count: s.count,
  }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Here&apos;s how your pipeline is performing today.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard
            label="Total Leads"
            value={stats.totalLeads ?? 0}
            icon={<GroupsOutlinedIcon />}
            accent="#5B6EE1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard
            label="Qualified Leads"
            value={stats.qualifiedLeads ?? 0}
            icon={<VerifiedOutlinedIcon />}
            accent="#3FA772"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard
            label="Closed Deals"
            value={stats.closedDeals ?? 0}
            icon={<HandshakeOutlinedIcon />}
            accent="#E3A335"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard
            label="Revenue"
            value={revenueFormatted}
            icon={<PaidOutlinedIcon />}
            accent="#8A6FD1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <KpiCard
            label="Lost Leads"
            value={stats.lostLeads ?? 0}
            icon={<HighlightOffOutlinedIcon />}
            accent="#D2564A"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Leads by Status
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="status" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.status} fill={getStatusColor(entry.status, mode)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Pipeline Distribution
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={barData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {barData.map((entry) => (
                      <Cell key={entry.status} fill={getStatusColor(entry.status, mode)} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {statsStatus === "loading" && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Refreshing stats...
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
