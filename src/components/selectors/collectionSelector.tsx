"use client";

import { setCollectionCookie } from "@/actions/cookieActions";
import { CollectionData } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CollectionSelector({
  collections,
  initialCollection,
}: {
  collections: CollectionData[];
  initialCollection: string;
}) {
  const [_, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      defaultValue={initialCollection}
      onValueChange={(value) => {
        startTransition(async () => {
          await setCollectionCookie(value);
          router.push("/");
        });
      }}
    >
      <SelectTrigger id="collection">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="max-h-48 overflow-y-scroll">
          {collections.map((collection, idx) => (
            <SelectItem key={idx} value={collection.name}>
              {collection.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
