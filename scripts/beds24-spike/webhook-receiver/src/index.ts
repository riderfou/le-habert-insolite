// CA7 – Récepteur de test des webhooks Beds24 : journalise chaque requête, répond 200.
// Pas de logique métier : le vrai traitement (signature, charge brute, idempotence) viendra en story 1.4.
//
// Adresse à donner à Beds24 : https://habert-beds24-webhook-test.<compte>.workers.dev/hook/<WEBHOOK_KEY>
// WEBHOOK_KEY (secret) évite que le journal se remplisse de requêtes étrangères :
//   npx wrangler secret put WEBHOOK_KEY

interface Env {
  WEBHOOK_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return new Response("Récepteur de test des webhooks Beds24 (story 1.1).\n");
    }

    const expected = env.WEBHOOK_KEY ? `/hook/${env.WEBHOOK_KEY}` : "/hook";
    if (url.pathname !== expected) {
      return new Response("Not found\n", { status: 404 });
    }

    const body = await request.text();
    let parsed: unknown = undefined;
    try {
      parsed = body ? JSON.parse(body) : undefined;
    } catch {
      // charge non JSON : on garde le texte brut
    }

    const headers: Record<string, string> = {};
    for (const [k, v] of request.headers) {
      headers[k] = v;
    }

    console.log(
      JSON.stringify({
        receivedAt: new Date().toISOString(),
        method: request.method,
        query: Object.fromEntries(url.searchParams),
        headers,
        bodyBytes: body.length,
        body: parsed ?? body,
      }),
    );

    return new Response("ok\n");
  },
} satisfies ExportedHandler<Env>;
