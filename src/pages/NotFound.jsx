import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    }}
  >
    <Typography variant="h3">404</Typography>
    <Typography color="text.secondary">Page not found</Typography>
    <Button component={RouterLink} to="/dashboard" variant="contained">
      Back to Dashboard
    </Button>
  </Box>
);

export default NotFound;
