import { Link } from "@tanstack/react-router";
import mark from "@/assets/foresite-mark.png";
import { BRAND } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${BRAND} home`}>
      <img src={mark} alt="" width={32} height={32} className="h-8 w-8 rounded-md" />
      <span
        className={cn(
          "text-[1.0625rem] font-semibold tracking-tight",
          tone === "light" ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {BRAND}
      </span>
    </Link>
  );
}
