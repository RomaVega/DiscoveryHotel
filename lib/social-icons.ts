/** Shared icon map for social platforms — used by Footer and ContactDetail */

import { Facebook, Instagram, Youtube } from "lucide-react";
import { TelegramIcon } from "@/components/common/TelegramIcon";

export const socialIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Facebook,
  Instagram,
  Youtube,
  Telegram: TelegramIcon,
};
