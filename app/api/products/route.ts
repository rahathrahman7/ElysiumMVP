import { NextResponse } from "next/server";
import { getProductsFiltered } from "@/lib/sanity/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const data = await getProductsFiltered(params);
  return NextResponse.json(data);
}










