import Link from "next/link";
import { Button } from "./ui/button";

export function Sidebar() {
  return (
    <div className="pb-12 w-1/4">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            MTG Library
          </h2>
          <div className="space-y-1">
            <Link href={`/view`}>
              <Button variant="ghost" className="w-full justify-start">
                View Cards
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            My Albums
          </h2>
          <Button variant="ghost" className="w-full justify-start">
            DMU
          </Button>
        </div>
      </div>
    </div>
  );
}
