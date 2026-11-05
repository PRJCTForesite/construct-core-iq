import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateOrganisationCode } from "./access";
describe("Controlled prototype registration", () => {
  test("requires an Organisation Code before activation", () => {
    assert.notEqual(validateOrganisationCode(""), null);
    assert.notEqual(validateOrganisationCode("   "), null);
    assert.equal(validateOrganisationCode("ABC-DEMO"), null);
  });
});