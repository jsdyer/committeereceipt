export const statuses = {
  figure: "Figure supplied",
  unavailable: "Figure unavailable",
  explanation: "Explanation only",
  unlocated: "No public reply located",
};
export function elapsed(hearing, reply) {
  if (!reply || !hearing) return null;
  const days =
    (Date.parse(reply + "T00:00:00Z") - Date.parse(hearing + "T00:00:00Z")) /
    86400000;
  return Number.isInteger(days) && days >= 0 ? days : null;
}
function plain(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export function filterCases(cases, query, status, meeting) {
  const words = plain(query).trim().split(/\s+/);
  return cases.filter((c) => {
    if (
      (status && status !== c.status) ||
      (meeting && Number(meeting) !== c.meeting)
    )
      return false;
    const text = plain(
      [
        c.title,
        c.speaker,
        c.organization,
        c.question,
        c.answer,
        c.period,
        c.hearing,
        c.reply,
        statuses[c.status],
      ].join(" "),
    );
    return words.every((w) => text.includes(w));
  });
}
