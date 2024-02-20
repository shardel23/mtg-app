"use server";

import * as API from "@/lib/scryfallApi";
import { SetData } from "@/types/types";

export async function getAllSets(): Promise<SetData[]> {
  const sets = await API.getAllSets();
  return sets.map((set) => ({ name: set.name, id: set.id }));
}
