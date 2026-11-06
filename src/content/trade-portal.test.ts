import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  COMPLIANCE, TRADE_CAN_CLOSE_DEFECTS, TRADE_DEFECTS, TRADE_DOCS, TRADE_TASKS, UPCOMING_WORKS,
  markDefectComplete, registrationReady, upcomingWithin, urgentActions, visibleTradeDocs,
} from "./trade-portal";

describe("trade portal rules", () => {
  test("trades cannot close defects", () => {
    assert.equal(TRADE_CAN_CLOSE_DEFECTS, false);
  });
  test("completing a defect with inspection enabled goes to Awaiting Inspection", () => {
    assert.equal(markDefectComplete(TRADE_DEFECTS[0]!).status, "Awaiting Inspection");
  });
  test("completing a defect without inspection goes to Awaiting Review", () => {
    assert.equal(markDefectComplete(TRADE_DEFECTS[2]!).status, "Awaiting Review");
  });
  test("only documents shared with the trade are visible", () => {
    const docs = visibleTradeDocs(TRADE_DOCS);
    assert.equal(docs.some((d) => d.name === "Head contract & margins"), false);
    assert.equal(docs.length, 5);
  });
  test("registration requires White Card, ABN, Trade Licence and Public Liability", () => {
    assert.equal(registrationReady(COMPLIANCE).ready, true);
    const noCard = COMPLIANCE.filter((c) => c.name !== "White Card");
    assert.deepEqual(registrationReady(noCard).missing, ["White Card"]);
  });
  test("upcoming works windows", () => {
    assert.equal(upcomingWithin(UPCOMING_WORKS, 7).length, 1);
    assert.equal(upcomingWithin(UPCOMING_WORKS, 14).length, 2);
    assert.equal(upcomingWithin(UPCOMING_WORKS, 30).length, 4);
  });
  test("urgent actions counts due today and overdue", () => {
    const u = urgentActions(TRADE_TASKS, TRADE_DEFECTS);
    assert.equal(u.dueToday, 1);
    assert.equal(u.overdue, 1);
  });
});
