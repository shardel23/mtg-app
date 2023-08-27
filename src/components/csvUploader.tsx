"use client";

import { csvFileToArray } from "@/lib/utils";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const fileReader = new FileReader();

function CSVUploader() {
  const [file, setFile] = useState<File>();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFile(e.target.files![0]);
  };

  const handleOnSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target?.result as string;
        const array = csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div className="flex text-center justify-between items-center">
      <div>
        <Input
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
        disabled={!file}
      >
        Import CSV
      </Button>
    </div>
  );
}

export default CSVUploader;
