"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";

export default function Provider({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  return (
    <div className="rounded border p-4">
      <button
        data-testid={`login-button-${provider.name.toLowerCase()}`}
        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
      >
        Sign in with {provider.name}
      </button>
    </div>
  );
}
