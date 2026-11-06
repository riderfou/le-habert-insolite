// CA5 – Crée une réservation de test par l'API, pour vérifier qu'elle bloque les dates sur Airbnb.
// Usage :
//   npx tsx create-test-booking.ts --arrival 2027-05-11 --departure 2027-05-12 [--room <roomId>]
//   npx tsx create-test-booking.ts --delete <bookingId>
// Prendre des dates libres, peu demandées, à plus de 6 mois. Supprimer la réservation dans la foulée.

import { createInterface } from "node:readline/promises";
import {
  api, checkTestDates, parseArgs, printCredits, requireVar, run, stringArg, TEST_MARKER, todayInParis,
} from "./lib.ts";

interface PostResult { success?: boolean; new?: { id?: number }; errors?: unknown[]; warnings?: unknown[] }
interface Booking { id: number; lastName?: string; arrival?: string; departure?: string; status?: string; channel?: string }

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} (oui/non) `);
  rl.close();
  return answer.trim().toLowerCase() === "oui";
}

async function create(arrival: string, departure: string, roomId: number): Promise<void> {
  const problems = checkTestDates(arrival, departure, todayInParis());
  if (problems.length) throw new Error(problems.join(" ; "));

  // Les dates doivent être libres dans le socle.
  const existing = await api<{ data?: Booking[] }>("GET", "/bookings", {
    query: { roomId, arrivalTo: departure, departureFrom: arrival },
  });
  const overlap = (existing.body.data ?? []).filter((b) => (b.arrival ?? "") < departure && (b.departure ?? "") > arrival);
  if (overlap.length) {
    throw new Error(`dates déjà occupées : ${overlap.map((b) => `${b.id} (${b.arrival} → ${b.departure})`).join(", ")}`);
  }

  if (!(await confirm(`Créer une réservation de test du ${arrival} au ${departure} sur le logement ${roomId} ?`))) return;

  const res = await api<PostResult[]>("POST", "/bookings", {
    body: [
      {
        roomId,
        status: "confirmed",
        arrival,
        departure,
        numAdult: 1,
        numChild: 0,
        firstName: "Test",
        lastName: TEST_MARKER,
        comment: "Réservation de test (story 1.1). À supprimer.",
        actions: { allowWebhooks: true },
      },
    ],
  });
  const result = res.body[0];
  if (res.status >= 300 || !result?.success || !result.new?.id) {
    throw new Error(`Échec POST /bookings (${res.status}) : ${JSON.stringify(res.body)}`);
  }
  const createdAt = new Date();
  console.log(`✓ Réservation de test créée : ${result.new.id}`);
  console.log(`  Heure de création : ${createdAt.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })} (Paris)`);
  if (result.warnings?.length) console.log(`  Avertissements : ${JSON.stringify(result.warnings)}`);
  console.log("\n  → Ouvrir le calendrier Airbnb et noter l'heure où les dates apparaissent bloquées (délai CA5).");
  console.log(`  → Puis supprimer : npx tsx create-test-booking.ts --delete ${result.new.id}`);
  printCredits(res.credits);
}

async function remove(id: number): Promise<void> {
  const found = await api<{ data?: Booking[] }>("GET", "/bookings", {
    query: { id, status: ["confirmed", "request", "new", "black", "inquiry", "cancelled"] },
  });
  const booking = found.body.data?.[0];
  if (!booking) throw new Error(`réservation ${id} introuvable`);
  // Garde-fou : on ne supprime jamais une vraie réservation.
  if (booking.lastName !== TEST_MARKER) {
    throw new Error(`la réservation ${id} n'est pas une réservation de test (nom « ${booking.lastName ?? ""} ») : suppression refusée`);
  }
  const res = await api<PostResult[]>("DELETE", "/bookings", { query: { id } });
  if (res.status >= 300 || res.body[0]?.success === false) {
    throw new Error(`Échec DELETE /bookings (${res.status}) : ${JSON.stringify(res.body)}`);
  }
  console.log(`✓ Réservation de test ${id} supprimée (${booking.arrival} → ${booking.departure}).`);
  console.log(`  Heure : ${new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })} (Paris)`);
  console.log("  → Vérifier sur Airbnb que les dates se libèrent et noter le délai.");
  printCredits(res.credits);
}

run(async () => {
  const args = parseArgs(process.argv.slice(2));
  const del = stringArg(args, "delete");
  if (del) return remove(Number(del));
  const arrival = stringArg(args, "arrival");
  const departure = stringArg(args, "departure");
  if (!arrival || !departure) {
    throw new Error("Usage : --arrival YYYY-MM-DD --departure YYYY-MM-DD [--room <roomId>]  ou  --delete <id>");
  }
  const roomId = Number(stringArg(args, "room") ?? requireVar("BEDS24_ROOM_ID"));
  return create(arrival, departure, roomId);
});
