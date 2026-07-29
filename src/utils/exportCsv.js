const escapeCsvValue = (value) => {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportLeadsToCsv = (leads, filename = "leads-export.csv") => {
  const headers = ["Name", "Email", "Phone", "Company", "Status", "Assigned To", "Revenue"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.status,
    lead.assignedTo,
    lead.revenue ?? 0,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
