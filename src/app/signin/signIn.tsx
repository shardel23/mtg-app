"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
} from "next-auth/react";
import { useEffect, useState } from "react";
import Provider from "./provider";

export default function SignIn() {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center gap-y-6">
      <h1 className="text-4xl"> MTG Collection App </h1>
      {providers &&
        Object.values(providers).map((provider) => (
          <Provider key={provider.name} provider={provider} />
        ))}
    </div>
  );
}
