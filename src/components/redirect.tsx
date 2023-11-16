import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RedirectIfNotLoggedIn() {
  const headersList = headers();
  const activePath = headersList.get("x-invoke-path");

  const session = await getServerSession(authOptions);
  const isLogged = session?.user != null;
  if (!isLogged) {
    redirect(`/signin`);
  }
  return <div />;
}
