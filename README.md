# Telegram Bot Project

A collection of Telegram bots with various capabilities, including joke delivery, algorithm implementation, and LeetCode problem solving powered by Google's Gemini AI.

## Features

- **JokeBot**: Delivers random jokes fetched from an API
- **GeminiBot**:
    - Provides algorithm implementations (binary search, quick sort, etc.)
    - Generates solutions to LeetCode problems using Gemini AI
- **LeetcodeBot**: Specialized bot focused on generating LeetCode solutions

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- A Telegram account
- A Google Cloud account (for Gemini API)

### Installation

1. **Clone the repository**
     ```bash
     git clone <repository-url>
     cd TelegramBot
     ```

2. **Install dependencies**
     ```bash
     npm install
     ```

3. **Generate API Keys**
     - **Telegram Bot Token**
         - Open Telegram and search for @BotFather
         - Send `/start` to BotFather
         - Send `/newbot` to create a new bot
         - Follow the prompts to name your bot
         - BotFather will provide a token - save this for later

     - **Gemini API Key**
         - Go to [Google AI Studio](https://ai.google.dev/)
         - Create an API key (if you don't have one)
         - Copy the API key

4. **Set up environment variables**
     - Create a `.env` file in the project root:
     ```
     TELEGRAM_BOT_TOKEN=your_telegram_token
     GEMINI_API_KEY=your_gemini_api_key
     ```

5. **Run the bot**
     Choose one bot to run:
     ```bash
     npm run jokebot
     # or
     npm run geminibot
     # or
     npm run leetcodebot
     ```

     > **IMPORTANT**: Run only one bot instance at a time. Running multiple bots with the same token will cause the error: `ETELEGRAM: 409 Conflict: terminated by other getUpdates request`.

## Usage

Start a chat with your bot on Telegram (using the username you created with BotFather)

### JokeBot Commands
- `/start` - Get a welcome message
- `/help` - Get help information
- `/joke` - Get a random joke

### GeminiBot & LeetcodeBot
- Send any LeetCode problem URL (e.g., `https://leetcode.com/problems/rising-temperature/`)
- OR simply type an algorithm name like "binary search", "quick sort", etc.

## Examples

**User Input:**
```
https://leetcode.com/problems/two-sum/
```

**Bot Response:**
```python
def twoSum(nums, target):
        num_map = {}
        for i, num in enumerate(nums):
                complement = target - num
                if complement in num_map:
                        return [num_map[complement], i]
                num_map[num] = i
        return []
```
