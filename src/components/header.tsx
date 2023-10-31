import {
  getAllAlbums,
  getAllCollections,
  getAllSets,
  getCollection,
} from "@/actions/mtgActions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Auth from "./auth";
import CardSearch from "./cardSearch";
import HamburgerMenu from "./hamburgerMenu";
import CollectionSelector from "./selectors/collectionSelector";
import { Label } from "./ui/label";

async function Header() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  const collection = await getCollection();
  const collections = await getAllCollections();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center gap-x-8">
        <div className="flex w-24 text-2xl font-bold md:w-72 md:text-4xl">
          <Link href={`/`}>MTG Collection</Link>
        </div>
        <div className="hidden md:flex">
          <Auth />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-end text-xs md:hidden">
          {`Collection: ${collection}`}
        </div>
        <div className="flex items-center justify-end md:gap-x-8">
          <CardSearch />
          <div className="hidden w-48 items-center gap-x-4 md:flex">
            <Label>Collection: </Label>
            <CollectionSelector
              collections={collections}
              initialCollection={collection}
            />
          </div>
          <div className="flex md:hidden">
            <HamburgerMenu
              user={user}
              sets={sets}
              albums={albums}
              collection={collection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
