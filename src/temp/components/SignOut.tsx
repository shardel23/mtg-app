"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button className="rounded border p-2 text-sm" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
