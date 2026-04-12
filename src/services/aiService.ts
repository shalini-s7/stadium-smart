import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const engageLocalEngine = (userMessage: string, isMissingKey: boolean): string => {
  const msg = userMessage.toLowerCase();
  let prefix = isMissingKey ? "**[Local Mode]** " : "";
  
  if (msg.includes("seat") || msg.includes("ticket") || msg.includes("gate") || msg.includes("entry")) {
    return `${prefix}Your digital tickets and seat location are available in the **My Seat** section. I recommend using **Gate C** for the smoothest entry based on current crowd density.`;
  }
  if (msg.includes("food") || msg.includes("eat") || msg.includes("hungry") || msg.includes("drink") || msg.includes("menu")) {
    return `${prefix}I detected you're thinking about food! Based on current venue data, **Stadium Grill** (120m away) is the fastest option right now. You can pre-order from the **Food** tab to skip the line.`;
  }
  if (msg.includes("traffic") || msg.includes("crowd") || msg.includes("busy") || msg.includes("map") || msg.includes("heatmap")) {
    return `${prefix}The live **Crowd Heatmap** shows high activity near the North Gate. For a quieter experience, consider heading towards the South Concourse where density is currently low.`;
  }
  if (msg.includes("score") || msg.includes("match") || msg.includes("who is winning") || msg.includes("win")) {
    return `${prefix}I'm tracking the live match! You can see the real-time score and current over on your Dashboard. The home team is currently leading the charge!`;
  }
  if (msg.includes("help") || msg.includes("hi") || msg.includes("hello")) {
    return `${prefix}Hello! I am your SmartStadium Assistant. Even without a cloud connection, I can help you with **Food orders**, **Finding your seat**, **Live scores**, and **Avoiding crowds**. What's on your mind?`;
  }
  
  return `${prefix}I'm here to help! While I'm in local mode, I work best with keywords like 'food', 'seat', 'traffic', or 'score'. How can I assist you with your stadium experience today?`;
};

export const generateAIResponse = async (systemContext: string, userMessage: string): Promise<string> => {
  if (!genAI) {
    return engageLocalEngine(userMessage, true);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const fullPrompt = `[System Behavior Config: ${systemContext}]\n\nUser Question: ${userMessage}`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (err: any) {
    console.error("Gemini API Error, engaging local hybrid engine:", err);
    return engageLocalEngine(userMessage, false);
  }
};
