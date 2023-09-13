import { generateCsv, mkConfig } from "export-to-csv";

export const csvConfig = mkConfig({ useKeysAsHeaders: true });

export async function exportDataToCSV(data: any) {
  return generateCsv(csvConfig)(data);
}
