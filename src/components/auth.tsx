import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SignOut from "./signOut";

export default async function Auth() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user != null) {
    return (
      <div className="flex gap-x-2 items-center">
        <span>{user.name}</span>
        <SignOut />
      </div>
    );
  }
  return <Link href="/api/auth/signin">Sign In</Link>;
}
