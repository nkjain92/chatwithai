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
  try {
    const { messages, temperature, model } = (await req.json()) as {
      messages: Message[];
      temperature?: number;
      model?: string;
    };

    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      stream: true,
      temperature: temperature || 0.7,
      messages,
    });

    // Transform the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'There was an error processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
