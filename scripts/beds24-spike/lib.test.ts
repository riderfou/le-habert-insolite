import { test } from "node:test";
import assert from "node:assert/strict";
import { addMonths, checkTestDates, isIsoDate, parseArgs, parseDevVars, todayInParis, upsertDevVar } from "./lib.ts";

test("parseDevVars lit clés, guillemets et commentaires", () => {
  const vars = parseDevVars('# commentaire\nA=1\nB="deux = 2"\n\nC=\'trois\'\nmauvaise ligne\n');
  assert.deepEqual(vars, { A: "1", B: "deux = 2", C: "trois" });
});

test("upsertDevVar remplace une clé existante sans toucher aux autres", () => {
  const out = upsertDevVar('A="1"\nB="2"\n', "A", "x");
  assert.equal(out, 'A="x"\nB="2"\n');
});

test("upsertDevVar ajoute une clé à un fichier vide ou existant", () => {
  assert.equal(upsertDevVar("", "K", "v"), 'K="v"\n');
  assert.equal(upsertDevVar('A="1"\n\n', "K", "v"), 'A="1"\nK="v"\n');
});

test("isIsoDate refuse les dates impossibles", () => {
  assert.equal(isIsoDate("2027-02-28"), true);
  assert.equal(isIsoDate("2027-02-30"), false);
  assert.equal(isIsoDate("2027-2-3"), false);
});

test("addMonths ramène le jour à la fin du mois", () => {
  assert.equal(addMonths("2026-11-06", 18), "2028-05-06");
  assert.equal(addMonths("2026-08-31", 6), "2027-02-28");
  assert.equal(addMonths("2027-12-15", 1), "2028-01-15");
});

test("todayInParis suit le fuseau Europe/Paris", () => {
  // 23 h 30 UTC le 31 décembre = déjà le 1er janvier à Paris.
  assert.equal(todayInParis(new Date("2026-12-31T23:30:00Z")), "2027-01-01");
});

test("checkTestDates exige des dates valides, ordonnées, à plus de 6 mois", () => {
  const today = "2026-11-06";
  assert.deepEqual(checkTestDates("2027-06-01", "2027-06-02", today), []);
  assert.match(checkTestDates("2027-01-10", "2027-01-11", today).join(), /6 mois/);
  assert.match(checkTestDates("2027-06-02", "2027-06-02", today).join(), /après l'arrivée/);
  assert.match(checkTestDates("2027-06-31", "2027-07-02", today).join(), /invalide/);
});

test("parseArgs distingue valeurs et drapeaux", () => {
  const args = parseArgs(["x", "--booking", "42", "--json", "--send", "Bonjour"]);
  assert.equal(args.booking, "42");
  assert.equal(args.json, true);
  assert.equal(args.send, "Bonjour");
  assert.deepEqual(args._, ["x"]);
});
