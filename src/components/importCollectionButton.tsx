"use client";

import { createAlbumsFromCSV } from "@/actions/mtgActions";
import { csvFileToArray } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ImportCollectionButton() {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File>();
  const [fileReader, setFileReader] = useState<FileReader>();

  useEffect(() => {
    setFileReader(new FileReader());
  }, []);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFile(e.target.files![0]);
  };

  const handleOnSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (file && fileReader) {
      fileReader.onload = function (event) {
        const text = event.target?.result as string;
        const array = csvFileToArray(text);
        const cards = array.map((row) => {
          return {
            cardId: row["cardScryfallId"],
            setId: row["setScryfallId"],
            numCollected: Number.parseInt(row["numCollected"]),
          };
        });
        startTransition(async () => {
          await createAlbumsFromCSV(cards);
        });
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-between text-center">
      <div>
        <Input
          className="w-24"
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
      </div>
      <Button
        variant={"default"}
        onClick={(e) => {
          handleOnSubmit(e);
        }}
        disabled={!file || isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Import CSV
      </Button>
    </div>
  );
}
