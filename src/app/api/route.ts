import { generateChat } from "@/lib/api/ollamaservice";
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

  const userResponse = result.response;

  if (userResponse) {
    return userResponse;
  }
}
