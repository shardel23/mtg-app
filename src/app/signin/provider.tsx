"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";

export default function Provider({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  return (
    <div className="rounded border p-4">
      <button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
        Sign in with {provider.name}
      </button>
    </div>
  );
}
