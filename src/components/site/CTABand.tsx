import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PORTAL_URL } from "@/content/site";

export function CTABand({
  title = "Ready to run construction on one platform?",
  description = "See how Foresite brings projects, tasks, defects, documents and financial performance into a single operating system.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="container-page flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="mt-3 text-primary-foreground/70">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-azure text-azure-foreground hover:bg-azure/90">
            <Link to="/contact">Book</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a href={`${PORTAL_URL}/register`}>Get Started</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
