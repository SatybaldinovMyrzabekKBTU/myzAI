import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates lyrics based on user parameters.
 */
export const generateLyrics = async (
  topic: string,
  genre: string,
  mood: string,
  structure: string
): Promise<string> => {
  try {
    const prompt = `
      Act as a professional songwriter. Write lyrics for a song with the following details:
      Topic: ${topic}
      Genre: ${genre}
      Mood: ${mood}
      Structure: ${structure}
      
      Output only the lyrics with section headers (e.g., [Verse 1], [Chorus]). 
      Do not include conversational filler.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class songwriter and music producer.",
        temperature: 0.7,
      }
    });

    return response.text || "No lyrics generated.";
  } catch (error) {
    console.error("Error generating lyrics:", error);
    throw error;
  }
};

/**
 * Generates album art based on a description.
 */
export const generateAlbumArt = async (description: string): Promise<string | null> => {
  try {
    // Using the recommended image model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: description,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating art:", error);
    throw error;
  }
};

/**
 * General chat for musical brainstorming.
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    // Transform history to the format expected by the SDK if needed, 
    // but for simple single-turn or managed history, we can just use generateContent 
    // with context or use the chat API. Let's use chat API for better context management.
    
    // Note: In this simple implementation, we re-create the chat session for the demo 
    // to ensure statelessness or manage state in the component. 
    // Ideally, we'd persist the Chat object, but for React HMR safety, we'll initialize fresh.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful music theory expert, audio engineer, and band manager. Keep answers concise and related to music.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};
