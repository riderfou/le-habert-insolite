// Vérifie le jeton de rafraîchissement et affiche les droits (scopes) du jeton d'accès obtenu.
// Usage : npx tsx token.ts

import { api, getAccessToken, printCredits, run } from "./lib.ts";

run(async () => {
  const token = await getAccessToken();
  console.log(`✓ Jeton d'accès obtenu (${token.slice(0, 6)}…, valable 24 h au plus).`);

  const details = await api<{ validToken?: boolean; token?: { scopes?: string[]; expiresIn?: number } }>(
    "GET",
    "/authentication/details",
  );
  const scopes = details.body.token?.scopes ?? [];
  console.log(`  Droits : ${scopes.join(", ") || "(non renvoyés)"}`);

  const expected = ["bookings", "bookings-personal", "inventory", "properties", "channels"];
  const missing = expected.filter((s) => !scopes.some((got) => got === s || got.endsWith(`:${s}`)));
  if (scopes.length && missing.length) {
    console.log(`  ⚠ Droits attendus absents : ${missing.join(", ")}. Régénérer un code d'invitation.`);
  }
  printCredits(details.credits);
});
