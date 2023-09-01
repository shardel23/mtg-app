import { getAllAlbums, getAllSets } from "@/actions/mtgActions";
import Link from "next/link";
import CardSearch from "./cardSearch";
import HamburgerMenu from "./hamburgerMenu";

async function Header() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  return (
    <div className="flex items-center justify-between gap-x-2 md:justify-normal md:gap-x-8">
      <div className="font-bold text-xl w-24 md:text-4xl md:w-72">
        <Link href={`/`}>MTG Collection</Link>
      </div>
      <CardSearch />
      <div className="flex md:hidden">
        <HamburgerMenu sets={sets} albums={albums} />
      </div>
    </div>
  );
}

export default Header;
