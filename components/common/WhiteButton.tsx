// White-bordered button for use on dark (deep-teal) backgrounds
import { cn } from "@/lib/utils";

const BASE_STYLES =
  "inline-block bg-transparent hover:bg-white/10 border border-white hover:border-white/80 " +
  "text-white font-sans font-semibold px-5 py-2 rounded-full tracking-wide uppercase text-xs " +
  "transition-all duration-300 " +
  "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2";

interface WhiteButtonBase {
  children: React.ReactNode;
  className?: string;
}

interface WhiteButtonAsLink extends WhiteButtonBase {
  href: string;
  external?: boolean;
  onClick?: never;
}

interface WhiteButtonAsButton extends WhiteButtonBase {
  href?: never;
  external?: never;
  onClick: () => void;
}

type WhiteButtonProps = WhiteButtonAsLink | WhiteButtonAsButton;

export function WhiteButton({ children, className, ...rest }: WhiteButtonProps) {
  const styles = cn(BASE_STYLES, className);

  if ("onClick" in rest && rest.onClick) {
    return (
      <button onClick={rest.onClick} className={styles}>
        {children}
      </button>
    );
  }

  const { href, external } = rest as WhiteButtonAsLink;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <a href={href!} className={styles}>
      {children}
    </a>
  );
}
