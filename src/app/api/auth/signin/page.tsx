import { getProviders } from "next-auth/react";
import Provider from "./provider";

export default async function SignInPage({ params }: { params: any }) {
  const providers = (await getProviders()) ?? [];

  return (
    <div className="flex flex-col items-center gap-y-6">
      <h1 className="text-4xl"> MTG Collection App </h1>
      {Object.values(providers).map((provider) => (
        <Provider key={provider.name} provider={provider} />
      ))}
    </div>
  );
}
