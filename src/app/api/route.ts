import { generateChat } from "@/lib/api/ollamaservice";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await generateChat({
    model: "solar",
    messages: [
      {
        role: "user",
        content: body.message,
      },
    ],
  });

  return result.response;
}
