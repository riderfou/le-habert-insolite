// Échange le code d'invitation API V2 contre un jeton de rafraîchissement, écrit dans .dev.vars.
// Usage : npx tsx setup.ts <code-d-invitation>
// Le code se génère dans Beds24 : Settings → Account → API (https://beds24.com/control3.php?pagetype=apiv2).

import { API_BASE, DEV_VARS_PATH, run, writeDevVar } from "./lib.ts";

run(async () => {
  const code = process.argv[2];
  if (!code) throw new Error("Usage : npx tsx setup.ts <code-d-invitation>");

  const res = await fetch(`${API_BASE}/authentication/setup`, {
    headers: { code, deviceName: "le-habert-insolite-spike", accept: "application/json" },
  });
  const body = (await res.json()) as { token?: string; refreshToken?: string; expiresIn?: number };
  if (!res.ok || !body.refreshToken) {
    throw new Error(`Échec /authentication/setup (${res.status}) : ${JSON.stringify(body)}`);
  }

  writeDevVar("BEDS24_REFRESH_TOKEN", body.refreshToken);
  console.log(`✓ Jeton de rafraîchissement écrit dans ${DEV_VARS_PATH}`);
  console.log("  Il reste valable tant qu'il sert au moins une fois tous les 30 jours.");
  console.log("  Le code d'invitation est consommé : inutile de le garder.");
});
