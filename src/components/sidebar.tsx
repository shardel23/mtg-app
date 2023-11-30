import { getAllAlbums, getAllSets } from "@/actions/mtgActions";
import Link from "next/link";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import ExportCollectionButton from "./exportCollectionButton";
import ImportCollectionButton from "./importCollectionButton";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export async function Sidebar() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  return (
    <div className="fixed left-0 hidden h-[90%] w-72 overflow-x-auto overflow-y-scroll border-r-2 no-scrollbar md:flex">
      <div className="flex w-full flex-col space-y-8 px-6 py-8">
        <SidebarSection
          title="My Albums"
          titleButton={<CreateNewAlbumDialog sets={sets} />}
        >
          <div className="flex flex-row md:flex-col md:space-y-1">
            {albums.map((album) => (
              <Button
                asChild
                key={album.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href={`/album/${album.id}`}>{album.name}</Link>
              </Button>
            ))}
          </div>
        </SidebarSection>
        <SidebarSection title="Views">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href={`/trades`}>Tradeable Cards</Link>
          </Button>
        </SidebarSection>
        <SidebarSection title="Options">
          <div className="flex w-full flex-col items-center justify-start space-y-1">
            <div className="flex w-full flex-row md:flex-col">
              <ExportCollectionButton />
            </div>
            <div className="flex w-full flex-row md:flex-col">
              <ImportCollectionButton />
            </div>
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

const SidebarSection = ({
  title,
  titleButton,
  children,
}: {
  title: string;
  titleButton?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-start">
        <h2 className="text-sm font-semibold tracking-tight md:px-4 md:text-lg">
          {title}
        </h2>
        {titleButton}
      </div>
      <Separator className="my-4 bg-white" />
      {children}
    </div>
  );
};
