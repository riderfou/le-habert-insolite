// CA6 – Lit les messages d'une réservation Airbnb ; envoie un message de test avec --send.
// Usage :
//   npx tsx messages.ts                         (messages des 30 derniers jours, toutes réservations)
//   npx tsx messages.ts --booking <id>          (fil d'une réservation)
//   npx tsx messages.ts --booking <id> --send "Texte du message"
// L'envoi ne fonctionne que pour une réservation venue d'un canal (Airbnb). Choisir un voyageur volontaire.

import { createInterface } from "node:readline/promises";
import { api, getAllPages, parseArgs, printCredits, run, stringArg } from "./lib.ts";

interface Message { id: number; bookingId?: number; source?: string; time?: string; message?: string; read?: boolean | null }

run(async () => {
  const args = parseArgs(process.argv.slice(2));
  const bookingId = stringArg(args, "booking");
  const text = stringArg(args, "send");

  if (text !== undefined) {
    if (!bookingId) throw new Error("--send exige --booking <id>");
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(`Envoyer au voyageur de la réservation ${bookingId} :\n  « ${text} »\nConfirmer (oui/non) `);
    rl.close();
    if (answer.trim().toLowerCase() !== "oui") return;

    const res = await api<{ success?: boolean; errors?: unknown[] }[]>("POST", "/bookings/messages", {
      body: [{ bookingId: Number(bookingId), message: text }],
    });
    if (res.status >= 300 || !res.body[0]?.success) {
      throw new Error(`Échec POST /bookings/messages (${res.status}) : ${JSON.stringify(res.body)}`);
    }
    console.log(`✓ Message envoyé à ${new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })} (Paris).`);
    console.log("  → Vérifier qu'il apparaît dans la messagerie Airbnb et noter le délai.");
    printCredits(res.credits);
    return;
  }

  const messages = await getAllPages<Message>(
    "/bookings/messages",
    bookingId ? { bookingId: Number(bookingId) } : { maxAge: 30 },
  );
  messages.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  console.log(`${messages.length} message(s)\n`);
  for (const m of messages) {
    const when = m.time ? new Date(m.time).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) : "?";
    const body = (m.message ?? "").replace(/\s+/g, " ").slice(0, 120);
    console.log(`[${when}] résa ${m.bookingId} · ${m.source ?? "?"}${m.read === false ? " · non lu" : ""}\n  ${body}`);
  }
});
