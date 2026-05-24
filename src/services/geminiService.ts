import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAIInstance() {
  if (ai) return ai;

  // Retrieve the API key from environment variables (checking both Vite's meta env and process env fallback)
  const apiKey =
    (import.meta as any).env.VITE_GEMINI_API_KEY ||
    (typeof process !== "undefined" && process.env
      ? (process.env.GEMINI_API_KEY || process.env.apiKey || process.env.apikey)
      : "") ||
    "";

  if (!apiKey || apiKey.trim() === "") {
    console.warn("Gemini API key is not set. Google Gen AI features will be disabled.");
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (err) {
    console.error("Failed to initialize Google Gen AI:", err);
    return null;
  }
}

export async function getAIStrategyResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const aiInstance = getAIInstance();
    if (!aiInstance) {
      return "I'm currently undergoing scheduled maintenance. Please contact the team directly at mrbadshaff@gmail.com or 7575088632!";
    }

    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash", // Use standard flash model (gemini-2.5-flash) for maximum stability
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the Nexus Digital Solutions AI Strategy Bot. Your goal is to provide instant client consultation for a high-end digital agency. 
        Agency Services: Full-Stack Web Development (MERN), Android App Building, SEO, Video Editing, and Logo Design.
        Tone: Professional, futuristic, creative, and highly knowledgeable.
        Guidelines:
        1. Keep responses concise and impactful.
        2. Always steer the conversation towards how Nexus can solve the user's business needs.
        3. Mention the agency's name: "Nexus Digital Solutions".
        4. If a user asks for a quote, suggest they use the "Quotation Engine" on the website or contact the team directly.
        5. Contact Info if asked: 7575088632 or mrbadshaff@gmail.com.
        6. STRICTLY ONLY ANSWER QUESTIONS RELATED TO NEXUS DIGITAL SOLUTIONS, THEIR SERVICES, PROJECTS, OR TECHNOLOGY STACKS.
        7. IF THE USER ASKS ABOUT UNRELATED TOPICS (e.g. general knowledge, other companies, personal advice), POLITELY DECLINE AND RE-CENTER THE CONVERSATION ON NEXUS DIGITAL SOLUTIONS.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm experiencing a minor sync issue with the Nexus core. Please try again or contact us directly at mrbadshaff@gmail.com.";
  }
}

