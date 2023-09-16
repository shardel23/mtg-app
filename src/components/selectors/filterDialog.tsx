import { Dispatch, SetStateAction, useState } from "react";
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
  setFilters,
}: {
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Filters</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Select filters</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <IsCollectedSelector setFilters={setLocalFilters} />
          <RaritySelector setFilters={setLocalFilters} />
          <ColorSelector setFilters={setLocalFilters} />
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
