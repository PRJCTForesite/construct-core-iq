import { describe, expect, it } from "vitest";
import { compactCurrency, compactFigure } from "./compact-figures";

describe("small tile figures", () => {
  it("abbreviates thousands", () => expect(compactFigure("$284,500")).toBe("$285K"));
  it("keeps the plus sign on growth figures", () => expect(compactFigure("+$142,800")).toBe("+$143K"));
  it("leaves plain counts alone", () => expect(compactFigure("14")).toBe("14"));
  it("abbreviates millions with one decimal", () => expect(compactCurrency(1_200_000)).toBe("$1.2M"));
  it("rolls 999.6K up to millions", () => expect(compactCurrency(999_600)).toBe("$1M"));
});
