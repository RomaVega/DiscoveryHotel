import Link from "next/link";
import { cn } from "@/lib/utils";

const BASE_STYLES =
  "inline-block bg-transparent border border-brand-teal text-brand-teal " +
  "hover:bg-brand-teal hover:text-white hover:scale-[1.04] active:scale-[0.97] " +
  "font-sans font-semibold px-5 py-2 rounded-full tracking-wide text-xs whitespace-nowrap " +
  "transition-all duration-300 " +
  "focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2";

interface SecondaryButtonBase {
  children: React.ReactNode;
  className?: string;
}

interface SecondaryButtonAsLink extends SecondaryButtonBase {
  href: string;
  external?: boolean;
  onClick?: never;
}

interface SecondaryButtonAsButton extends SecondaryButtonBase {
  href?: never;
  external?: never;
  onClick: () => void;
}

type SecondaryButtonProps = SecondaryButtonAsLink | SecondaryButtonAsButton;

export function SecondaryButton({ children, className, ...rest }: SecondaryButtonProps) {
  const styles = cn(BASE_STYLES, className);

  if ("onClick" in rest && rest.onClick) {
    return (
      <button onClick={rest.onClick} className={styles}>
        {children}
      </button>
    );
  }

  const { href, external } = rest as SecondaryButtonAsLink;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href!} className={styles}>
      {children}
    </Link>
  );
}
