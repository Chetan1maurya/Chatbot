import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";
export const Message = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey:process.env.GOOGLE_GEMINI_API_KEY,
    });
    const text = req.body.text;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }
    const handleAIResponse = async (text) => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "You are a Talking Bot, Your name is Chota Don. You have to reply to user instructions in very short as possible, talk like a friend.",
        },
      });
      console.log(response.text);
      return response.text;
    };
    const user = await User.create({
      sender: "user",
      text: text,
    });
    //Data
    const botResponses = {
      "hello": "Hey, How I can help you!!",
      "can we become friend": "Yes",
      "how are you": "Chota Don ko kisi se problem nahi hai, kisi aur ko jarur chota don se problem ho sakti hai...",
      "what is your name?": "I’m ChatBot, your virtual assistant.",
      "who made you":
        "I was created by developers to help answer your questions.",
      "tell me a joke":
        "Why don’t skeletons fight each other? They don’t have the guts!",
      "what is the time": "I can’t see a clock, but your device should know.",
      "bye": "Goodbye! Have a great day.",
      "thank you": "You’re welcome!",
      "i love you": "That’s sweet! I’m here to help you anytime.",
      "where are you from": "I live in the cloud — no rent, no bills!",
    };
    const normalizedText = text.toLowerCase().trim();
    const botResponse =
      botResponses[normalizedText] || await handleAIResponse(normalizedText);
    const bot = await Bot.create({
      text: botResponse,
    });

    return res.status(200).json({
      userMessage: user.text,
      botMessage: bot.text,
    });
  } catch (err) {
    console.log("Error in Message Controller", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
