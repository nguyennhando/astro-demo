// src/lib/orderService.ts
// Geschäftslogik für Bestellungen
// - Artikel normalisieren
// - NUR EINEN sale.order anlegen
// - Note sauber trennen: Küche / Bar
// - BAR-Monitor đọc đúng dữ liệu

import { odooRpc } from "./odooClient";

/* =========================
   Typen
========================= */
export interface Customer {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
}

export interface RawItem {
  id?: string;        // product.product ID (STRING aus Frontend)
  name?: string;
  price?: number | string;
  qty?: number | string;
  area?: string;      // "kitchen" | "bar"
}

export interface NormalizedItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  area: "kitchen" | "bar";
}

/* =========================
   Artikel normalisieren
========================= */
export function normalizeItems(rawItems: RawItem[]): NormalizedItem[] {
  return rawItems.map((it) => {
    const idNum = Number(it.id);
    if (!idNum || isNaN(idNum)) {
      throw new Error(`Produkt-ID fehlt oder ungültig: ${it.name ?? "Unbekannt"}`);
    }

    const qtyNum = Number(it.qty ?? 1);
    const priceNum = Number(it.price ?? 0);

    const rawArea = typeof it.area === "string" ? it.area.toLowerCase().trim() : "kitchen";
    const area: "kitchen" | "bar" = rawArea === "bar" ? "bar" : "kitchen";

    return {
      id: idNum,
      name: String(it.name ?? "Unbekannt"),
      price: !isNaN(priceNum) ? priceNum : 0,
      qty: !isNaN(qtyNum) && qtyNum > 0 ? qtyNum : 1,
      area,
    };
  });
}

/* =========================
   order_line bauen
========================= */
function buildLines(items: NormalizedItem[]) {
  return items.map((it) => [
    0,
    0,
    {
      product_id: it.id,
      name: it.name,
      price_unit: it.price,
      product_uom_qty: it.qty,
    },
  ]);
}

/* =========================
   Note pro Bereich bauen
========================= */
function buildAreaNote(
  title: string,
  customer: Customer,
  items: NormalizedItem[]
): string {
  if (items.length === 0) return "";

  return `
[${title}]
Name: ${customer.name ?? ""}
Telefon: ${customer.phone ?? ""}
E-Mail: ${customer.email ?? ""}
Hinweis: ${customer.note ?? ""}
`.trim();
}


/* =========================
   EIN Auftrag in Odoo
========================= */
export async function createSingleOrder(
  customer: Customer,
  rawItems: RawItem[]
): Promise<{ order_id: number }> {

  const items = normalizeItems(rawItems);
  if (items.length === 0) {
    throw new Error("Warenkorb ist leer.");
  }

  // Trennung nach Bereich
  const kitchenItems = items.filter((i) => i.area === "kitchen");
  const barItems = items.filter((i) => i.area === "bar");

  // Note sauber aufbauen
  const note = [
    buildAreaNote("BẾP / KÜCHE", customer, kitchenItems),
    buildAreaNote("QUẦY NƯỚC / BAR", customer, barItems),
  ].filter(Boolean).join("\n\n");

  const orderId = await odooRpc("sale.order", "create", [
    {
      partner_id: 1,      // Default-Kunde (anpassen falls nötig)
      note,
      order_line: buildLines(items),
    },
  ]);

  return { order_id: orderId };
}
