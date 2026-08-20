#!/usr/bin/env node
// Warns when the published "Scores verified: <month> <year>" stamp is older than
// the current month.
//
// The stamp is a trust claim: it tells a visitor someone checked these numbers
// against the platforms recently. So this script never rewrites the date — it
// only says the numbers are due a look. Bumping `verifiedOn` without opening the
// four pages would make the claim false, which is worse than a date that is
// visibly a month old.
//
// Review counts drift *down* as often as up (platforms prune old reviews), so a
// re-check means reading the current score and count off each page, not assuming
// they only grow.
//
// Exit 0 always — this is a heads-up, not a gate. Run by the SessionStart hook
// in .claude/settings.json, and safe to run by hand.

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "content", "reviews.json");
const { aggregates } = JSON.parse(fs.readFileSync(file, "utf8"));

if (!Array.isArray(aggregates) || aggregates.length === 0) process.exit(0);

const now = new Date();
const thisMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

// The site renders the OLDEST date across platforms, so that is what goes stale.
const oldest = aggregates.reduce(
  (acc, a) => (a.verifiedOn < acc ? a.verifiedOn : acc),
  aggregates[0].verifiedOn
);
const shownMonth = oldest.slice(0, 7);

if (shownMonth === thisMonth) process.exit(0);

const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
  .format(new Date(`${oldest}T00:00:00Z`));
const nowName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(now);

const stale = aggregates.filter((a) => a.verifiedOn.slice(0, 7) !== thisMonth);

console.log(`⏰ Ratings say "Scores verified: ${monthName}" — it is now ${nowName}.`);
console.log(`   Open each page, read the score and review count as shown, then update`);
console.log(`   content/reviews.json (score, count AND verifiedOn) so the site matches the source:\n`);
for (const a of stale) {
  console.log(`   ${a.platform.padEnd(12)} site says ${a.score}/${a.scale}, ${a.count} reviews  (checked ${a.verifiedOn})`);
  console.log(`   ${" ".repeat(12)} ${a.url}`);
}
console.log(`\n   Tripadvisor blocks automated requests — that one needs a human eye.`);
