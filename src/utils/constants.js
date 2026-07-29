export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Closed", "Lost"];

export const STATUS_COLORS = {
  New: { light: "#5B6EE1", dark: "#8391F0" },
  Contacted: { light: "#8A6FD1", dark: "#B39EE8" },
  Qualified: { light: "#3FA772", dark: "#63C795" },
  Closed: { light: "#E3A335", dark: "#F0B94F" },
  Lost: { light: "#D2564A", dark: "#E37B71" },
};

export const getStatusColor = (status, mode = "light") =>
  STATUS_COLORS[status]?.[mode] || "#9AA3B2";
