import { getAllAlbums } from "@/actions/get/getAllAlbumsAction";
import { getAllSets } from "@/actions/get/getAllSetsAction";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Auth from "./Auth";
import CardSearch from "./CardSearch";
import HamburgerMenu from "./HamburgerMenu";

async function Header() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="fixed top-0 z-10 flex flex-initial h-16 md:h-24 w-full justify-between border-b-2 bg-slate-950 p-3 md:p-8 md:pt-6">
      <div className="flex items-center gap-x-8">
        <div className="flex flex-col w-40 md:w-64">
          <Link data-testid="app-banner" href={`/`}>
            <div className="text-2xl md:text-4xl font-bold">SuperMTG</div>
            <div className="text-xs md:text-lg">Your Collection Manager</div>
          </Link>
        </div>
      </div>
      <CardSearch />
      <div className="flex items-center justify-between gap-x-1 md:gap-x-8">
        <div className="flex md:hidden">
          {user && <HamburgerMenu user={user} sets={sets} albums={albums} />}
        </div>
        <div className="hidden md:flex">
          <Auth />
        </div>
      </div>
    </div>
  );
}

export default Header;
