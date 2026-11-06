import { describe, expect, test } from "bun:test";
import {
  COMPLIANCE, TRADE_CAN_CLOSE_DEFECTS, TRADE_DEFECTS, TRADE_DOCS, TRADE_TASKS, UPCOMING_WORKS,
  markDefectComplete, registrationReady, upcomingWithin, urgentActions, visibleTradeDocs,
} from "./trade-portal";

describe("trade portal rules", () => {
  test("trades cannot close defects", () => {
    expect(TRADE_CAN_CLOSE_DEFECTS).toBe(false);
  });
  test("completing a defect with inspection enabled goes to Awaiting Inspection", () => {
    expect(markDefectComplete(TRADE_DEFECTS[0]!).status).toBe("Awaiting Inspection");
  });
  test("completing a defect without inspection goes to Awaiting Review", () => {
    expect(markDefectComplete(TRADE_DEFECTS[2]!).status).toBe("Awaiting Review");
  });
  test("only documents shared with the trade are visible", () => {
    const docs = visibleTradeDocs(TRADE_DOCS);
    expect(docs.some((d) => d.name === "Head contract & margins")).toBe(false);
    expect(docs).toHaveLength(5);
  });
  test("registration requires White Card, ABN, Trade Licence and Public Liability", () => {
    expect(registrationReady(COMPLIANCE).ready).toBe(true);
    const noCard = COMPLIANCE.filter((c) => c.name !== "White Card");
    expect(registrationReady(noCard).missing).toEqual(["White Card"]);
  });
  test("upcoming works windows", () => {
    expect(upcomingWithin(UPCOMING_WORKS, 7)).toHaveLength(1);
    expect(upcomingWithin(UPCOMING_WORKS, 14)).toHaveLength(2);
    expect(upcomingWithin(UPCOMING_WORKS, 30)).toHaveLength(4);
  });
  test("urgent actions counts due today and overdue", () => {
    const u = urgentActions(TRADE_TASKS, TRADE_DEFECTS);
    expect(u.dueToday).toBe(1);
    expect(u.overdue).toBe(1);
  });
});
