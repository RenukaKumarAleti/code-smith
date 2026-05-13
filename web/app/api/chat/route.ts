export const runtime = "edge";

type RequestBody = {
  model?: string;
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  max_tokens?: number;
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!body.system || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing system prompt or messages" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const upstream = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || "claude-sonnet-4-6",
      max_tokens: body.max_tokens || 16000,
      system: body.system,
      messages: body.messages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let frameEnd = buffer.indexOf("\n\n");
          while (frameEnd !== -1) {
            const frame = buffer.slice(0, frameEnd);
            buffer = buffer.slice(frameEnd + 2);
            frameEnd = buffer.indexOf("\n\n");

            for (const line of frame.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload);
                if (
                  evt.type === "content_block_delta" &&
                  evt.delta?.type === "text_delta" &&
                  typeof evt.delta.text === "string"
                ) {
                  controller.enqueue(encoder.encode(evt.delta.text));
                } else if (evt.type === "error") {
                  controller.enqueue(
                    encoder.encode(
                      `\n\n[error] ${evt.error?.message ?? "Unknown error"}`,
                    ),
                  );
                }
              } catch {
                // Anthropic occasionally emits non-JSON ping frames.
              }
            }
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n\n[error] ${(err as Error).message}`),
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
