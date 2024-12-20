import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create a text stream using the Vercel AI SDK
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
    });

    // Return the stream directly
    return new Response(textStream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'There was an error processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
