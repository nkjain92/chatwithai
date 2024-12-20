import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens, topP } = await req.json();

    // Ensure we have at least one message
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Messages array cannot be empty',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      stream: true,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048,
      top_p: topP || 1,
      messages: messages.map((message: any) => ({
        role: message.role,
        content: message.content,
      })),
    });

    // Create a TransformStream for handling the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    // Return a streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
