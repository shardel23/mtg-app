import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { UserNav } from "./UserNav";

export default async function Auth() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user != null) {
    return (
      <div className="flex items-center gap-x-2">
        <UserNav user={user} />
      </div>
    );
  }
  return <Link href="/api/auth/signin">Sign In</Link>;
}
