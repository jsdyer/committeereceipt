import { elapsed, filterCases, statuses } from "./model.mjs";
const $ = (id) => document.getElementById(id);
const make = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
const link = (label, href) => {
  const a = make("a", label);
  a.href = href;
  return a;
};
const pretty = (s) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(s + "T00:00:00Z"));
let data,
  selected = location.hash.slice(1);
let filtered = [];
function drawReceipt(c) {
  const out = $("receipt");
  out.replaceChildren();
  if (!c) {
    out.append(
      make("h2", "No matching exchange"),
      make(
        "p",
        "Try a shorter search or choose a different hearing or outcome.",
      ),
    );
    return;
  }
  const status = make("p", statuses[c.status], "status " + c.status);
  const head = make("div", undefined, "detail-head");
  head.append(status, link("Link to exchange", "#" + c.id));
  const days = elapsed(c.hearing, c.reply);
  const dates = make("dl", undefined, "dates");
  for (const [k, v] of [
    ["Question asked", pretty(c.hearing)],
    [
      "Reply dated",
      c.reply ? pretty(c.reply) : c.document ? "Date unstated" : "No match",
    ],
    ["Elapsed", days === null ? "Unknown" : days + " days"],
  ]) {
    const d = make("div");
    d.append(make("dt", k), make("dd", v));
    dates.append(d);
  }
  out.append(
    head,
    make("h2", c.title),
    make("p", c.speaker + " · " + c.organization, "byline"),
    dates,
    make("h3", "Question"),
    make("p", c.question),
    make(
      "h3",
      c.status === "unlocated" ? "Public record reviewed" : "Written follow-up",
    ),
    make("p", c.answer),
    make("h3", "Period covered"),
    make("p", c.period),
  );
  const source = make("div", undefined, "documents");
  source.append(
    make("h3", "Read the record"),
    link("Hearing transcript · meeting " + c.meeting, c.transcript),
  );
  if (c.document)
    source.append(link("Written reply · PDF p. " + c.page, c.document));
  for (const more of c.extra) source.append(link(more.label, more.url));
  source.append(make("p", c.locator, "meta"));
  out.append(source);
}
function draw() {
  filtered = filterCases(
    data.cases,
    $("search").value,
    $("outcome").value,
    $("meeting").value,
  );
  if (!filtered.some((c) => c.id === selected))
    selected = filtered[0]?.id || "";
  $("count").textContent =
    filtered.length + " " + (filtered.length === 1 ? "exchange" : "exchanges");
  const list = $("records");
  list.replaceChildren();
  for (const c of filtered) {
    const a = link("", "#" + c.id);
    a.className = "record";
    if (c.id === selected) a.setAttribute("aria-current", "true");
    a.append(
      make("span", statuses[c.status], "small " + c.status),
      make("strong", c.title),
      make("span", c.speaker + " · " + pretty(c.hearing), "brief"),
    );
    a.onclick = (e) => {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      selected = c.id;
      history.replaceState(null, "", "#" + c.id);
      draw();
      if (matchMedia("(max-width:760px)").matches)
        $("receipt").scrollIntoView();
      else $("records").querySelector("[aria-current]").focus();
    };
    list.append(a);
  }
  drawReceipt(filtered.find((c) => c.id === selected));
}
window.addEventListener("hashchange", () => {
  if (!data?.cases.some((c) => c.id === location.hash.slice(1))) return;
  selected = location.hash.slice(1);
  $("search").value = "";
  $("outcome").value = "";
  $("meeting").value = "";
  draw();
});
try {
  const response = await fetch("./receipts.json");
  if (!response.ok) throw Error();
  data = await response.json();
  const hearings = [
    ...new Map(data.cases.map((c) => [c.meeting, c.hearing])),
  ].sort((a, b) => a[0] - b[0]);
  $("coverage").textContent =
    data.period +
    " · " +
    hearings.length +
    " hearings · reviewed " +
    pretty(data.reviewed);
  for (const [k, v] of Object.entries(statuses))
    $("outcome").append(new Option(v, k));
  for (const [k, v] of hearings)
    $("meeting").append(new Option("Meeting " + k + " · " + pretty(v), k));
  $("search").oninput = draw;
  $("outcome").onchange = draw;
  $("meeting").onchange = draw;
  draw();
} catch {
  $("coverage").textContent =
    "The records could not load. Please reload the page.";
}
