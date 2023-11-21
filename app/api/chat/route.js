// app/api/chat/route.js

import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Extract the last message content from the messages array
  const lastUserMessage = messages[messages.length - 1].content;

  // Request the HuggingFace API for the response based on the last user message
  const response = await Hf.textGenerationStream({
    model: "tiiuae/falcon-7b-instruct",
    inputs: lastUserMessage, // Use the last user message as input
    parameters: {
      max_new_tokens: 200,
      temperature: 0.5,
      top_p: 0.95,
      top_k: 4,
      repetition_penalty: 1.03,
      truncate: 1000,
    },
  });

  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
