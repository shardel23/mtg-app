"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

export function CopyAlbumShareLink({ relativePath }: { relativePath: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const url = `${window.location.origin}${relativePath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [relativePath]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0"
      aria-label={copied ? "Link copied" : "Copy album link to clipboard"}
      title={copied ? "Copied" : "Copy album link"}
      onClick={() => void copy()}
    >
      {copied ? (
        <Check className="h-6 w-6" aria-hidden strokeWidth={2} />
      ) : (
        <Copy className="h-6 w-6" aria-hidden strokeWidth={2} />
      )}
    </Button>
  );
}
