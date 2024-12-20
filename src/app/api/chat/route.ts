import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client (edge-compatible)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    const { messages } = await req.json();

    // Check if messages array is valid
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages array', { status: 400 });
    }

    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}
