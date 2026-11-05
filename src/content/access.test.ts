import { describe, expect, test } from "bun:test";
import { validateOrganisationCode } from "./access";
describe("Controlled prototype registration", () => {
  test("requires an Organisation Code before activation", () => {
    expect(validateOrganisationCode("")).not.toBeNull();
    expect(validateOrganisationCode("   ")).not.toBeNull();
    expect(validateOrganisationCode("ABC-DEMO")).toBeNull();
  });
});