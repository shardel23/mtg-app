"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
} from "next-auth/react";
import { useEffect, useState } from "react";
import Provider from "./Provider";

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
    <div className="flex flex-col items-center gap-y-8 max-w-lg w-full px-4">
      <div className="flex flex-col items-center gap-y-4 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Welcome to SuperMTG</h1>
        <p className="text-xl text-slate-400">
          Sign in to start managing your MTG collection
        </p>
      </div>

      <div className="w-full flex flex-col gap-y-4">
        {providers &&
          Object.values(providers).map((provider) => (
            <Provider key={provider.name} provider={provider} />
          ))}
      </div>
    </div>
  );
}
