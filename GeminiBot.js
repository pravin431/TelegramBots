// GeminiBot.mjs (ensure package.json contains "type": "module")

import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

// Initialize environment variables
config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BOT_TOKEN = process.env.BOT_TOKEN;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Load algorithm data from a JSON file
const algorithmsFilePath = path.join(process.cwd(), "algorithms.json");
let algorithmData = {};
try {
  const fileContent = fs.readFileSync(algorithmsFilePath, "utf8");
  algorithmData = JSON.parse(fileContent);
} catch (err) {
  console.error("Error reading algorithms JSON file:", err);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Regular expression to detect a LeetCode URL
const leetcodeRegex = /leetcode\.com\/problems\/([^\/]+)/i;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  // First check: does the text contain a LeetCode URL?
  const match = text.match(leetcodeRegex);
  if (match) {
    // Extract the question slug, e.g., "reverse-nodes-in-k-group"
    const questionSlug = match[1];
    // For a better prompt, replace hyphens with spaces
    const formattedQuestion = questionSlug.replace(/-/g, " ");
    const prompt = `Write solution code for the LeetCode problem "${formattedQuestion}" in any language in 4000 characters . Include inline comments and use proper formatting. Enclose your entire solution within triple backticks for clear markdown formatting.`;
    
    try {
      // Call the Gemini API to generate a solution
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      // Send Gemini's response (formatted in Markdown)
      bot.sendMessage(chatId, geminiResponse.text, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Error fetching answer from Gemini:", error);
      bot.sendMessage(chatId, "Sorry, I had trouble fetching the answer for that question.");
    }
  } else {
    // Otherwise, treat the message as an algorithm query
    // We'll use lowercase comparison for keys.
    const query = text.toLowerCase();
    if (algorithmData[query]) {
      const codeSnippets = algorithmData[query];
      let replyMessage = `*Code for "${query}":*\n\n`;
      // For each language, include code in a markdown code block
      for (const [language, code] of Object.entries(codeSnippets)) {
        replyMessage += `*${language.toUpperCase()}*\n\`\`\`${code}\`\`\`\n\n`;
      }
      // Send the formatted message with Markdown mode
      bot.sendMessage(chatId, replyMessage, { parse_mode: "Markdown" });
    } else {
      // If no algorithm is found, ask the user to send a valid input.
      bot.sendMessage(chatId, "Please send a valid LeetCode problem URL or an algorithm name (e.g., 'binary search', 'quick sort').");
    }
  }
});
