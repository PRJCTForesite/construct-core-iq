// Demo-only Trade Directory data for the public website showcase.
export type Availability = "Available" | "Busy" | "Unavailable";

export type DirectoryTrade = {
  id: string;
  name: string;
  trade: string;
  location: string;
  region: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  completed: number;
  activeJobs: number;
  capacity: number;
  licence: string;
  licenceVerified: boolean;
  insuranceVerified: boolean;
  tickets: string[];
  serviceAreas: string[];
  overview: string;
  contact: { name: string; phone: string; email: string };
  preferred?: "plus" | "minus";
  reviewQuotes: { by: string; text: string }[];
};

export const TRADE_TYPES = ["All", "Electrician", "Plumber", "Roofer", "Carpenter", "Plasterer"] as const;
export const LOCATIONS = ["All", "Melbourne", "Geelong", "Sydney"] as const;
export const RADII = [10, 20, 50, 100] as const;
export const COMPLIANCE = ["Working At Heights", "Confined Spaces", "White Card", "EWP"] as const;

/** Availability derives from active jobs against the trade's capacity threshold. */
export function availabilityFor(activeJobs: number, capacity: number, override?: Availability): Availability {
  if (override) return override;
  if (capacity <= 0 || activeJobs >= capacity) return "Unavailable";
  if (activeJobs / capacity >= 0.75) return "Busy";
  return "Available";
}

export const DIRECTORY: DirectoryTrade[] = [
  {
    id: "abc-electrical", name: "Meridian Electrical Co.", trade: "Electrician", location: "Melbourne", region: "Melbourne Metro",
    distanceKm: 8, rating: 4.9, reviews: 31, completed: 67, activeJobs: 3, capacity: 8,
    licence: "REC 28431", licenceVerified: true, insuranceVerified: true,
    tickets: ["Working At Heights", "White Card", "EWP"], serviceAreas: ["Melbourne CBD", "Inner East", "Bayside"],
    overview: "Residential and light commercial electrical contractor specialising in new builds and switchboard upgrades.",
    contact: { name: "Sam Patel", phone: "0400 111 222", email: "jobs@abcelectrical.example" }, preferred: "plus",
    reviewQuotes: [{ by: "Northline Builders", text: "On time, tidy and compliance docs uploaded the same day." }],
  },
  {
    id: "spark-co", name: "Spark & Co Electrical", trade: "Electrician", location: "Melbourne", region: "Melbourne North",
    distanceKm: 17, rating: 4.6, reviews: 21, completed: 38, activeJobs: 5, capacity: 6,
    licence: "REC 30112", licenceVerified: true, insuranceVerified: true,
    tickets: ["White Card", "Working At Heights"], serviceAreas: ["Coburg", "Preston", "Epping"],
    overview: "Fit-off and data cabling team for multi-unit residential.",
    contact: { name: "Lena Ho", phone: "0400 333 444", email: "hello@sparkco.example" },
    reviewQuotes: [{ by: "Urbanform", text: "Responsive team, good communication through Foresite." }],
  },
  {
    id: "volt-geelong", name: "Volt Geelong", trade: "Electrician", location: "Geelong", region: "Geelong & Surf Coast",
    distanceKm: 72, rating: 4.4, reviews: 12, completed: 25, activeJobs: 4, capacity: 4,
    licence: "REC 19870", licenceVerified: true, insuranceVerified: false,
    tickets: ["White Card"], serviceAreas: ["Geelong", "Torquay"],
    overview: "Regional electrical contractor for residential renovations.",
    contact: { name: "Chris Dunn", phone: "0400 555 666", email: "office@voltgeelong.example" }, preferred: "minus",
    reviewQuotes: [{ by: "Coastline Homes", text: "Good work but insurance renewal was late." }],
  },
  {
    id: "abc-roofing", name: "Ridgeline Roofing", trade: "Roofer", location: "Melbourne", region: "Melbourne Metro",
    distanceKm: 12, rating: 4.8, reviews: 33, completed: 71, activeJobs: 2, capacity: 6,
    licence: "DB-L 4421", licenceVerified: true, insuranceVerified: true,
    tickets: ["Working At Heights", "White Card"], serviceAreas: ["Melbourne Metro", "Mornington"],
    overview: "Metal and tile roofing, leak investigation and rectification.",
    contact: { name: "Mia Clarke", phone: "0400 777 888", email: "quotes@abcroofing.example" }, preferred: "plus",
    reviewQuotes: [{ by: "Bayside Townhouses Stage 2", text: "Found and fixed the leak within 48 hours." }],
  },
  {
    id: "elite-roofing", name: "Summit Roof Co.", trade: "Roofer", location: "Melbourne", region: "Melbourne East",
    distanceKm: 19, rating: 4.7, reviews: 18, completed: 40, activeJobs: 4, capacity: 5,
    licence: "DB-L 5120", licenceVerified: true, insuranceVerified: true,
    tickets: ["Working At Heights", "EWP"], serviceAreas: ["Box Hill", "Ringwood"],
    overview: "Commercial roofing and box gutter specialists.",
    contact: { name: "Tom Reid", phone: "0400 999 000", email: "ops@eliteroofing.example" },
    reviewQuotes: [{ by: "Apex Commercial", text: "Excellent safety records and documentation." }],
  },
  {
    id: "flowright", name: "FlowRight Plumbing", trade: "Plumber", location: "Sydney", region: "Sydney Inner West",
    distanceKm: 9, rating: 4.5, reviews: 27, completed: 52, activeJobs: 1, capacity: 5,
    licence: "PL 77812", licenceVerified: true, insuranceVerified: true,
    tickets: ["Confined Spaces", "White Card"], serviceAreas: ["Inner West", "CBD"],
    overview: "Hydraulics for residential and mid-rise construction.",
    contact: { name: "Ava Nguyen", phone: "0400 121 343", email: "team@flowright.example" },
    reviewQuotes: [{ by: "Harbour Build Co", text: "Reliable and always first to respond to defects." }],
  },
];

export type DirectoryFilters = {
  query: string;
  trade: string;
  location: string;
  radiusKm: number;
  compliance: string[];
  availableOnly: boolean;
};

export function filterDirectory(list: DirectoryTrade[], f: DirectoryFilters) {
  const q = f.query.trim().toLowerCase();
  return list.filter((t) => {
    if (q && !`${t.name} ${t.trade} ${t.region}`.toLowerCase().includes(q)) return false;
    if (f.trade !== "All" && t.trade !== f.trade) return false;
    if (f.location !== "All" && t.location !== f.location) return false;
    if (t.distanceKm > f.radiusKm) return false;
    if (!f.compliance.every((c) => t.tickets.includes(c))) return false;
    if (f.availableOnly && availabilityFor(t.activeJobs, t.capacity) !== "Available") return false;
    return true;
  });
}

/** AI recommendation demo: prefer available, previously-used (Trades+), then highest rated. */
export function recommendTrades(list: DirectoryTrade[], trade: string, limit = 3) {
  return list
    .filter((t) => t.trade === trade && t.preferred !== "minus")
    .sort((a, b) => {
      const av = (t: DirectoryTrade) => (availabilityFor(t.activeJobs, t.capacity) === "Unavailable" ? 1 : 0);
      return av(a) - av(b) || (b.preferred === "plus" ? 1 : 0) - (a.preferred === "plus" ? 1 : 0) || b.rating - a.rating;
    })
    .slice(0, limit);
}
