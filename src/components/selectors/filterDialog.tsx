"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Filter } from "../filters";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ColorSelector from "./colorSelector";
import IsCollectedSelector from "./isCollectedSelector";
import RaritySelector from "./raritySelector";

export default function FilterDialog({
  filters,
  setFilters,
}: {
  filters: Map<string, Filter>;
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [localFilters, setLocalFilters] = useState<Map<string, Filter>>(
    new Map()
  );

  const applyFilters = () => {
    setIsDialogOpen(false);
    setFilters(localFilters);
  };

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(newValue) => {
        setIsDialogOpen(newValue);
        setLocalFilters(filters);
      }}
    >
      <DialogTrigger asChild>
        <Button>Filters</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Select filters</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <IsCollectedSelector
            selected={localFilters.get("isCollected")?.inputValues || []}
            setFilters={setLocalFilters}
          />
          <RaritySelector
            selected={localFilters.get("rarity")?.inputValues || []}
            setFilters={setLocalFilters}
          />
          <ColorSelector
            selected={localFilters.get("color")?.inputValues || []}
            setFilters={setLocalFilters}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              applyFilters();
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
