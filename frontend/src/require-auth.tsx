"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/logowanie?next=/mapa");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <p className="px-6 py-16 text-sm text-muted-foreground">
        Sprawdzam sesję…
      </p>
    );
  }

  if (!session) return null;
  return <>{children}</>;
}