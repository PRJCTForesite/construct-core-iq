import { test } from "node:test";
import assert from "node:assert/strict";
import { SHOWCASE_VIEWS, showcaseSelection } from "./platform-showcase";

test("each stakeholder section resolves its own independent records", () => {
  const collections = new Set();
  for (const view of SHOWCASE_VIEWS) {
    for (const [index, section] of view.sections.entries()) {
      const selected = showcaseSelection(view.id, index);
      assert.equal(selected?.view, view);
      assert.equal(selected?.section, section);
      assert.ok(section.rows.length > 0);
      assert.ok(!collections.has(section.rows));
      collections.add(section.rows);
    }
  }
  assert.equal(collections.size, 18);
});

test("invalid selection falls back to the first available section", () => {
  assert.equal(showcaseSelection("client", 999)?.section, SHOWCASE_VIEWS[1]?.sections[0]);
  assert.equal(showcaseSelection("unknown", 0)?.view, SHOWCASE_VIEWS[0]);
});