import RedirectIfNotLoggedIn from "@/components/redirect";

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center p-24">
      <div>Welcome to MTG Collection App!</div>
      <div>ToDo: Dashboard, stats, etc.. </div>
      <RedirectIfNotLoggedIn />
    </div>
  );
}
