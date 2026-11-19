import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { DIRECTORY, availabilityFor, filterDirectory, recommendTrades } from "./trade-directory";

const base = { query: "", trade: "All", location: "All", radiusKm: 100, compliance: [] as string[], availableOnly: false };

describe("trade directory", () => {
  test("availability follows capacity thresholds", () => {
    assert.equal(availabilityFor(2, 8), "Available");
    assert.equal(availabilityFor(6, 8), "Busy");
    assert.equal(availabilityFor(8, 8), "Unavailable");
  });
  test("manual override wins", () => {
    assert.equal(availabilityFor(1, 8, "Unavailable"), "Unavailable");
  });
  test("electrician, Melbourne, 20km, heights, available", () => {
    const r = filterDirectory(DIRECTORY, { ...base, trade: "Electrician", location: "Melbourne", radiusKm: 20, compliance: ["Working At Heights"], availableOnly: true });
    assert.deepEqual(r.map((t) => t.id), ["abc-electrical"]);
  });
  test("recommendations exclude Trades- warnings", () => {
    assert.equal(recommendTrades(DIRECTORY, "Electrician").some((t) => t.preferred === "minus"), false);
  });
});
