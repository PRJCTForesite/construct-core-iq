import { describe, test } from "node:test";
import assert from "node:assert/strict";
const expect = (a: unknown) => ({ toBe: (e: unknown) => assert.equal(a, e), toEqual: (e: unknown) => assert.deepEqual(a, e) });
import { INITIAL_RECORDS, makeRecord } from "@/content/platform";
import { commitRecord, realRecords } from "@/content/sample-data";

const ids = new Set(INITIAL_RECORDS.map((r) => r.id));
const count = (rs: typeof INITIAL_RECORDS, k: string) => rs.filter((r) => r.kind === k).length;

describe("sample data removal", () => {
  test("first real defect removes all sample defects only", () => {
    const real = makeRecord("Defect", "Cracked tile");
    const { records } = commitRecord(INITIAL_RECORDS, real, ids);
    expect(records.filter((r) => r.kind === "Defect").map((r) => r.id)).toEqual([real.id]);
    expect(count(records, "Project")).toBe(count(INITIAL_RECORDS, "Project"));
    expect(count(records, "Task")).toBe(count(INITIAL_RECORDS, "Task"));
  });
  test("first real project removes sample projects", () => {
    const { records } = commitRecord(INITIAL_RECORDS, makeRecord("Project", "Harbour Apartments"), ids);
    expect(count(records, "Project")).toBe(1);
  });
  test("editing a sample record keeps the other samples", () => {
    const sample = INITIAL_RECORDS.find((r) => r.kind === "Defect")!;
    const { records } = commitRecord(INITIAL_RECORDS, { ...sample, title: "Edited" }, ids);
    expect(count(records, "Defect")).toBe(count(INITIAL_RECORDS, "Defect"));
  });
  test("second real record keeps the first", () => {
    const a = commitRecord(INITIAL_RECORDS, makeRecord("Task", "A"), ids).records;
    const b = commitRecord(a, makeRecord("Task", "B"), ids).records;
    expect(count(b, "Task")).toBe(2);
  });
  test("only real records are submitted", () => {
    const a = commitRecord(INITIAL_RECORDS, makeRecord("Task", "A"), ids).records;
    expect(realRecords(a, ids).map((r) => r.title)).toEqual(["A"]);
  });
});
