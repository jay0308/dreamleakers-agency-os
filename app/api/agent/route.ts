import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { system, messages, max_tokens = 4000 } = await req.json();

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-5",
        max_tokens,
        system,
        messages
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    return NextResponse.json(response.data);

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}