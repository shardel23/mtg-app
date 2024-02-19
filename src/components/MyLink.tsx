"use client";

import Link from "next/link";

type MyLinkProps = {
  displayText: string;
  href: string;
  prefetch?: boolean;
};

export default function MyLink({ displayText, href, prefetch }: MyLinkProps) {
  return (
    <Link className="truncate" href={href} prefetch={prefetch ?? false}>
      {displayText}
    </Link>
  );
}
