import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL ?? "http://localhost:3001";

interface ApiResult {
  valid: boolean;
  errors: { message: string }[];
}

export async function POST(request: Request) {
  try {
    const response = await fetch(`${apiUrl}/schema-check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
      cache: "no-store"
    });
    const data = (await response.json()) as Partial<ApiResult>;
    return NextResponse.json(
      { valid: data.valid === true, messages: (data.errors ?? []).map((error) => error.message) },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { valid: false, messages: [`API nicht erreichbar: ${apiUrl}`] },
      { status: 502 }
    );
  }
}
