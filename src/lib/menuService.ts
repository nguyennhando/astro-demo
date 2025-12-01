// src/lib/menuService.ts
import { odooRpc } from "../lib/odooClient";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;   // tên Product Category
  imageUrl?: string;
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const products = await odooRpc("product.product", "search_read", [
    [
      ["sale_ok", "=", true],
    ],
    [
      "id",
      "name",
      "list_price",
      "description_sale",
      "categ_id",
      "image_128",
    ],
  ]);

  return (products as any[]).map((p) => {
    const categ = Array.isArray(p.categ_id) ? p.categ_id[1] : "";
    const imageUrl = p.image_128
      ? `data:image/png;base64,${p.image_128}`
      : undefined;

    return {
      id: p.id as number,
      name: p.name as string,
      price: p.list_price as number,
      description: (p.description_sale as string) || "",
      category: categ || "",
      imageUrl,
    };
  });
}
