// CA4 – Lit par l'API V2 les réservations dont l'arrivée tombe dans les 18 prochains mois.
// Usage : npx tsx list-bookings.ts [--months 18] [--json]

import { addMonths, getAllPages, parseArgs, run, stringArg, todayInParis } from "./lib.ts";

interface Booking {
  id: number;
  roomId?: number;
  status?: string;
  arrival?: string;
  departure?: string;
  channel?: string;
  referer?: string;
  apiReference?: string;
  firstName?: string;
  lastName?: string;
  numAdult?: number;
  numChild?: number;
  bookingTime?: string;
}

run(async () => {
  const args = parseArgs(process.argv.slice(2));
  const months = Number(stringArg(args, "months") ?? 18);
  const from = todayInParis();
  const to = addMonths(from, months);

  const bookings = await getAllPages<Booking>("/bookings", {
    arrivalFrom: from,
    arrivalTo: to,
    status: ["confirmed", "request", "new", "black", "inquiry"],
  });
  bookings.sort((a, b) => (a.arrival ?? "").localeCompare(b.arrival ?? ""));

  if (args.json) {
    console.log(JSON.stringify(bookings, null, 2));
    return;
  }
  console.log(`${bookings.length} réservation(s) avec arrivée du ${from} au ${to}\n`);
  for (const b of bookings) {
    const who = [b.firstName, b.lastName].filter(Boolean).join(" ") || "—";
    const pax = `${b.numAdult ?? 0}+${b.numChild ?? 0}`;
    console.log(
      `${String(b.id).padEnd(10)} ${b.arrival} → ${b.departure}  ${(b.channel || b.referer || "direct").padEnd(12)} ${(b.status ?? "?").padEnd(10)} ${pax.padEnd(5)} ${who}`,
    );
  }
  const byChannel = new Map<string, number>();
  for (const b of bookings) {
    const c = b.channel || b.referer || "direct";
    byChannel.set(c, (byChannel.get(c) ?? 0) + 1);
  }
  console.log(`\nPar canal : ${[...byChannel].map(([c, n]) => `${c} ${n}`).join(", ") || "—"}`);
});
