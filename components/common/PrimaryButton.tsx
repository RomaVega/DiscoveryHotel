import Link from "next/link";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function PrimaryButton({
  href,
  children,
  className,
  external = false,
}: PrimaryButtonProps) {
  const styles = cn(
    "inline-block bg-brand-teal hover:bg-deep-teal hover:scale-[1.04] active:scale-[0.97] text-white font-sans font-semibold",
    "px-8 py-3 rounded-full tracking-wide uppercase text-sm",
    "transition-colors duration-300",
    "focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
