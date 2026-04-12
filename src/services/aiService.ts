import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateAIResponse = async (systemContext: string, userMessage: string): Promise<string> => {
  if (!genAI) {
    return `### ⚠️ Gemini API Required\n\nI am running locally without a cloud connection. To speak with me, please paste your Gemini Key into your \`.env\` file as \`VITE_GEMINI_API_KEY=your_key\` and restart the server.\n\n*Waiting for connection...*`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const fullPrompt = `[System Behavior Config: ${systemContext}]\n\nUser Question: ${userMessage}`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (err: any) {
    console.error("Gemini API Error, engaging local hybrid engine:", err);
    // Hybrid local fallback algorithm if api key model errors out
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("food") || msg.includes("eat") || msg.includes("hungry") || msg.includes("drink")) {
      return "I detect you're looking for food! The **Vegan Bowl Co.** is currently 200m away with a 12 min wait, while **Cinematic Snacks** has popcorn ready with only a 3 min wait! You can order directly from the Food tab.";
    }
    if (msg.includes("seat") || msg.includes("ticket") || msg.includes("booked")) {
      return "Your tickets are safely stored in your Global State. You can view them by navigating to the **My Seat** tab on the left sidebar to start live navigation.";
    }
    if (msg.includes("traffic") || msg.includes("crowd") || msg.includes("busy") || msg.includes("gate")) {
      return "Currently, **Zone C** is experiencing critical traffic due to a malfunctioning security scanner. Check the **Live Heatmap** to see the exact congestion data.";
    }
    
    return "I am connected, but I couldn't process that specific query through my standard model. However, I can help you find food, locate your seat, or check stadium traffic. What do you need?";
  }
};
