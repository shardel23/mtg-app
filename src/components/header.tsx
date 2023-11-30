import { getAllAlbums, getAllSets } from "@/actions/mtgActions";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Auth from "./auth";
import CardSearch from "./cardSearch";
import HamburgerMenu from "./hamburgerMenu";

async function Header() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="fixed top-0 z-10 flex h-24 w-full justify-between border-b-2 bg-slate-950 p-3 md:p-8 md:pt-6">
      <div className="flex items-center gap-x-8">
        <div className="flex flex-col w-48 md:w-64">
          <Link data-testid="app-banner" href={`/`}>
            <div className="text-2xl md:text-4xl font-bold">SuperMTG</div>
            <div className="text-sm md:text-lg">Your collection manager</div>
          </Link>
        </div>
        <div className="hidden md:flex">
          <Auth />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-y-2">
        <div className="flex items-center justify-end md:gap-x-8">
          <CardSearch />
          <div className="flex md:hidden">
            {user && <HamburgerMenu user={user} sets={sets} albums={albums} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
