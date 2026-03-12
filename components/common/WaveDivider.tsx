import { cn } from "@/lib/utils";

interface WaveDividerProps {
  from?: string;
  to?: string;
  flip?: boolean;
  className?: string;
}

export function WaveDivider({
  from = "fill-sand",
  to = "fill-ivory",
  flip = false,
  className,
}: WaveDividerProps) {
  return (
    <div
      className={cn(
        "relative -mt-1 w-full overflow-hidden leading-[0]",
        flip && "rotate-180",
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block w-full h-12 md:h-16", to)}
      >
        <path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
          className={from}
        />
      </svg>
    </div>
  );
}
