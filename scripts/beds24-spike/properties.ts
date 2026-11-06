// Liste les propriétés et logements du compte, pour trouver le roomId du chalet.
// Usage : npx tsx properties.ts [--save]   (--save écrit BEDS24_PROPERTY_ID et BEDS24_ROOM_ID s'il n'y a qu'un logement)

import { getAllPages, parseArgs, run, writeDevVar } from "./lib.ts";

interface Room { id: number; name?: string; maxPeople?: number; qty?: number }
interface Property { id: number; name?: string; roomTypes?: Room[] }

run(async () => {
  const args = parseArgs(process.argv.slice(2));
  const properties = await getAllPages<Property>("/properties", { includeAllRooms: true });
  if (!properties.length) {
    console.log("Aucune propriété : créer « Le Habert insolite » dans Beds24 (CA2).");
    return;
  }
  const rooms: { propertyId: number; room: Room }[] = [];
  for (const p of properties) {
    console.log(`Propriété ${p.id} – ${p.name ?? "(sans nom)"}`);
    for (const r of p.roomTypes ?? []) {
      console.log(`  logement ${r.id} – ${r.name ?? "(sans nom)"} · ${r.maxPeople ?? "?"} pers. · quantité ${r.qty ?? "?"}`);
      rooms.push({ propertyId: p.id, room: r });
    }
  }
  if (args.save) {
    if (rooms.length !== 1) throw new Error(`${rooms.length} logements trouvés : renseigner BEDS24_ROOM_ID à la main.`);
    writeDevVar("BEDS24_PROPERTY_ID", String(rooms[0]!.propertyId));
    writeDevVar("BEDS24_ROOM_ID", String(rooms[0]!.room.id));
    console.log("✓ BEDS24_PROPERTY_ID et BEDS24_ROOM_ID écrits dans .dev.vars");
  }
});
