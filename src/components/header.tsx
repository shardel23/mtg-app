"use client";

import Link from "next/link";
import CardSearch from "./cardSearch";

function Header() {
  return (
    <div className="flex gap-x-8">
      <div className="font-bold text-xl md:text-4xl">
        <Link href={`/`}>MTG Collection</Link>
      </div>
      <CardSearch />
    </div>
  );
}

export default Header;
