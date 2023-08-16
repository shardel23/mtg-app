import { getAllSets } from "@/actions/mtgActions";
import ViewPageContent from "./viewPageContent";

export default async function ViewPage() {
  const sets = await getAllSets();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <ViewPageContent sets={sets} />
    </main>
  );
}
