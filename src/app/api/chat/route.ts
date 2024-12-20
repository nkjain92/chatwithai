import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Define the message type
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, temperature, model } = (await req.json()) as {
      messages: Message[];
      temperature?: number;
      model?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required and must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      stream: true,
      temperature: temperature || 0.7,
      messages: messages.map(message => ({
        role: message.role,
        content: message.content,
      })),
    });

    // Transform the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : 'There was an error processing your request',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
