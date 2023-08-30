"use client";

import Link from "next/link";
import CardSearch from "./cardSearch";

function Header() {
  return (
    <div className="flex items-center justify-between gap-x-2 md:justify-normal md:gap-x-8">
      <div className="font-bold text-xl w-36 md:text-4xl md:w-72">
        <Link href={`/`}>MTG Collection</Link>
      </div>
      <CardSearch />
    </div>
  );
}

export default Header;
