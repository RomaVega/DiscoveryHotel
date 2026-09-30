/**
 * Outline brand marks for Telegram and WhatsApp, drawn on lucide's grid.
 *
 * The footer's icons are one visual system: lucide's stroked Phone, Mail,
 * MapPin, Instagram, Facebook and Youtube. The filled `TelegramIcon` and the
 * full-colour `WhatsAppIcon` read as a second system beside them — a solid
 * plane among outlines — so the footer uses these instead. Both keep the
 * filled versions for the surfaces that already use them.
 *
 * Same 24px viewBox, round caps and joins as lucide, and the same
 * `{ size, strokeWidth, className }` props, so a call site can pass one
 * stroke weight to every icon in a row. Paths from Tabler Icons (MIT).
 */

interface OutlineIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function Outline({
  size = 24,
  strokeWidth = 2,
  className,
  children,
}: OutlineIconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function TelegramOutlineIcon(props: OutlineIconProps) {
  return (
    <Outline {...props}>
      <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </Outline>
  );
}

export function WhatsAppOutlineIcon(props: OutlineIconProps) {
  return (
    <Outline {...props}>
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </Outline>
  );
}
