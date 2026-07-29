import { createTheme } from "@mui/material/styles";

// Design identity: "Control Room" — a focused ops-desk feel for a sales team.
// Deep slate/navy base with a warm amber signal accent used sparingly for
// key metrics and calls-to-action. Status colors are desaturated so the
// amber accent still reads as the one "hot" color on the page.

const amber = "#E3A335";
const navy = "#111827";

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: amber,
        contrastText: "#1A1300",
      },
      secondary: {
        main: "#5B6EE1",
      },
      success: { main: "#3FA772" },
      warning: { main: "#E3A335" },
      error: { main: "#D2564A" },
      info: { main: "#5B6EE1" },
      background:
        mode === "dark"
          ? { default: "#0B0F17", paper: "#141A24" }
          : { default: "#F4F5F7", paper: "#FFFFFF" },
      divider: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)",
      text:
        mode === "dark"
          ? { primary: "#EDEFF3", secondary: "#9AA3B2" }
          : { primary: navy, secondary: "#5B6472" },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
      h1: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h5: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: "1px solid",
            borderColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)",
          },
        },
      },
    },
  });

export default getAppTheme;
