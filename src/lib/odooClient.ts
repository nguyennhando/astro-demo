// src/lib/odooClient.ts
import { createClient } from "node:http"; // <- KHÔNG cần cái này, chỉ example. Nếu bạn không dùng thì xoá.

// đúng file phải là như này:
const ODOO_URL =
  import.meta.env.ODOO_URL ?? "http://localhost:8069/jsonrpc";
const ODOO_DB = import.meta.env.ODOO_DB ?? "restaurant";
const ODOO_UID = Number(import.meta.env.ODOO_UID ?? 2);
const ODOO_PASSWORD =
  import.meta.env.ODOO_PASSWORD ?? "Nhan@2025";

// *** QUAN TRỌNG ***: phải có "export async function"
export async function odooRpc(
  model: string,
  method: string,
  args: any[]
) {
  const res = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [ODOO_DB, ODOO_UID, ODOO_PASSWORD, model, method, args],
      },
      id: Date.now(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Odoo HTTP-Fehler: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.error) {
    console.error("Odoo RPC Error:", json.error);
    throw new Error(json.error.data?.message || json.error.message);
  }
  return json.result;
}
