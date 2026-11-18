import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/foresite-logo-full.png.asset.json";
import { BRAND } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link to="/" className={cn("flex items-center", className)} aria-label={`${BRAND} home`}>
      <img src={logoAsset.url} alt={`${BRAND} - Combined Construction Systems`} width={160} height={41} className="h-10 w-auto" />
    </Link>
  );
}
