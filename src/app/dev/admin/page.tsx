import { isDevelopmentRuntime } from "@/lib/devAuth";
import { notFound } from "next/navigation";

import { DevAdminForm } from "./DevAdminForm";

export default function DevAdminPage() {
  if (!isDevelopmentRuntime()) {
    notFound();
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="flex max-w-lg flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Dev Admin</h1>
        <p className="text-muted-foreground text-sm">
          Impersonate a user by exact username
        </p>
      </div>
      <DevAdminForm />
    </div>
  );
}
