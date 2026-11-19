import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterCases, elapsed, statuses } from "../web/model.mjs";
const { cases } = JSON.parse(
  readFileSync(new URL("../web/receipts.json", import.meta.url)),
);
test("A reply interval uses question and reply dates; unknown dates stay unknown", () => {
  assert.equal(elapsed("2020-03-12", "2020-05-22"), 71);
  assert.equal(elapsed("2020-05-29", "2020-06-05"), 7);
  assert.equal(elapsed("2020-05-08", null), null);
});
test("Search combines speaker, topic, written outcome and hearing", () => {
  assert.equal(
    filterCases(cases, "McCauley tugboat", "figure", "5")[0].id,
    "tugboat-legal-costs",
  );
  assert.equal(filterCases(cases, "household", "unavailable", "15").length, 1);
  assert.equal(filterCases(cases, "cerb", "unlocated", "11").length, 1);
  assert.equal(filterCases(cases, "tugboat", "unavailable", "").length, 0);
});
test("Every matched answer has an exact page and hearing intervention", () => {
  const matched = cases.filter((c) => c.status !== "unlocated");
  assert.equal(matched.length, 8);
  for (const c of cases) {
    assert.ok(statuses[c.status]);
    assert.match(c.transcript, /#Int-\d+$/);
  }
  for (const c of matched) assert.ok(c.document.endsWith("#page=" + c.page));
});
