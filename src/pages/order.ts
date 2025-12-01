// src/pages/order.ts
import type { APIRoute } from "astro";
import {
  createSingleOrder,
  type Customer,
  type RawItem,
} from "../lib/orderService";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let data: any;

    try {
      data = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Body rỗng hoặc không phải JSON.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const customer: Customer = data.customer || {};
    const rawItems: RawItem[] = Array.isArray(data.items) ? data.items : [];

    if (!customer.name || !customer.phone) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Name und Telefon sind Pflichtfelder.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (rawItems.length === 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Warenkorb ist leer.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (import.meta.env.DEV) {
      console.log("ORDER BODY:", data);
    }

    const { order_id } = await createSingleOrder(customer, rawItems);

    return new Response(
      JSON.stringify({
        ok: true,
        order_id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Order API Error >>>", err);

    return new Response(
      JSON.stringify({
        ok: false,
        message: err?.message || "Serverfehler",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
