import { describe, expect, test } from "bun:test";
import { DIRECTORY, availabilityFor, filterDirectory, recommendTrades } from "./trade-directory";

const base = { query: "", trade: "All", location: "All", radiusKm: 100, compliance: [] as string[], availableOnly: false };

describe("trade directory", () => {
  test("availability follows capacity thresholds", () => {
    expect(availabilityFor(2, 8)).toBe("Available");
    expect(availabilityFor(6, 8)).toBe("Busy");
    expect(availabilityFor(8, 8)).toBe("Unavailable");
  });
  test("manual override wins", () => {
    expect(availabilityFor(1, 8, "Unavailable")).toBe("Unavailable");
  });
  test("electrician, Melbourne, 20km, heights, available", () => {
    const r = filterDirectory(DIRECTORY, { ...base, trade: "Electrician", location: "Melbourne", radiusKm: 20, compliance: ["Working At Heights"], availableOnly: true });
    expect(r.map((t) => t.name)).toEqual(["ABC Electrical"]);
  });
  test("recommendations exclude Trades- warnings", () => {
    expect(recommendTrades(DIRECTORY, "Electrician").some((t) => t.preferred === "minus")).toBe(false);
  });
});
