"use client";

import { exportCollectionToCSV } from "@/actions/others/exportCollectionToCsvAction";
import { csvConfig } from "@/lib/csv";
import { download } from "export-to-csv";
import { useTransition } from "react";
import { Button } from "./ui/button";

export default function ExportCollectionButton() {
  const [_, startTransition] = useTransition();

  return (
    <form
      action={async () => {
        startTransition(async () => {
          const csv = await exportCollectionToCSV();
          download(csvConfig)(csv);
        });
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start hover:cursor-pointer"
      >
        <div> Export Collection </div>
      </Button>
    </form>
  );
}
