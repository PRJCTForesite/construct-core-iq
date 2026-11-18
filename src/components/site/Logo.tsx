import { Link } from "@tanstack/react-router";
import logo from "@/assets/foresite-logo-transparent.png";
import { BRAND } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link to="/" className={cn("flex items-center", className)} aria-label={`${BRAND} home`}>
      <img src={logo} alt={`${BRAND} - Combined Construction Systems`} width={190} height={40} className="h-auto w-[190px] max-w-full" />
    </Link>
  );
}
