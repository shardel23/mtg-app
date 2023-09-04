import {
  getAllAlbums,
  getAllCollections,
  getAllSets,
  getCollection,
} from "@/actions/mtgActions";
import Link from "next/link";
import CardSearch from "./cardSearch";
import CollectionSelector from "./collectionSelector";
import HamburgerMenu from "./hamburgerMenu";
import { Label } from "./ui/label";

async function Header() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  const collection = await getCollection();
  const collections = await getAllCollections();
  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-between gap-x-2 md:justify-normal md:gap-x-8">
        <div className="font-bold text-xl w-24 md:text-4xl md:w-72">
          <Link href={`/`}>MTG Collection</Link>
        </div>
        <CardSearch />
      </div>
      <div className="flex items-center">
        <div className="w-48 hidden md:flex items-center gap-x-4">
          <Label>Collection: </Label>
          <CollectionSelector
            collections={collections}
            initialCollection={collection}
          />
        </div>
        <div className="flex md:hidden">
          <HamburgerMenu sets={sets} albums={albums} collection={collection} />
        </div>
      </div>
    </div>
  );
}

export default Header;
