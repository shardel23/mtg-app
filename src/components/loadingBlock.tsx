import { cn } from "@/lib/utils";

type LoadingBlockProps = {
  className?: string;
};

export default function LoadingBlock({ className }: LoadingBlockProps) {
  return (
    <div className={cn(className, `animate-pulse rounded bg-slate-800`)} />
  );
}
