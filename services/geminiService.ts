import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, never expose API keys on the client side.
// This should proxy through a backend. 
// For this demo, we assume the environment variable is set.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateProfessionalSummary = async (jobTitle: string, experience: string, keywords: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure process.env.API_KEY.";
  
  try {
    const prompt = `Write a professional resume summary for a ${jobTitle} with ${experience}. 
    Key strengths: ${keywords}. 
    Keep it under 4 sentences. 
    Tone: Professional, confident, action-oriented.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please try again.";
  }
};

export const improveBulletPoints = async (text: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const prompt = `Improve the following resume bullet points. 
    Make them action-oriented, quantifiable (if possible add placeholders for numbers), and professional.
    Keep the formatting as a list.
    
    Current text:
    ${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};