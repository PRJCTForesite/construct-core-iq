import { Link } from "@tanstack/react-router";
import mark from "@/assets/foresite-mark.png";
import { BRAND, POSITIONING, PORTAL_URL } from "@/content/site";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Industries", to: "/industries" },
      { label: "Pricing", to: "/pricing" },
      { label: "Download", to: "/download" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={mark} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-md" />
            <span className="text-[1.0625rem] font-semibold tracking-tight">{BRAND}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/65">
            {POSITIONING} for modern construction businesses and project delivery teams.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">Platform</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={PORTAL_URL}
                className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href={`${PORTAL_URL}/register`}
                className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Create Account
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
          </p>
          <p>{POSITIONING}</p>
        </div>
      </div>
    </footer>
  );
}
