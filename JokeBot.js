
// // process in nodejs global object and .env is object inside process
// console.log(process.env.TEST_VARIABLE);
// // console.log(process);

// console.log(process.platform); // windows or linux 
// console.log(process.version); // node.js version
// console.log(process.cwd());  // prints current working directory

import TelegramBot from 'node-telegram-bot-api';
import {config} from 'dotenv';
import axios from 'axios';

try {
    config();//it searches .env file in our file structure and loads key-value pairs from .env file into process.env
    
const TOKEN = process.env.BOT_TOKEN; //Your bot’s secret API key (from @BotFather), stored in .env.
// Create a bot object that uses 'polling' to fetch new updates
if (!TOKEN) {
    console.error("Error: BOT_TOKEN is not defined in the environment variables.");
    process.exit(1); // Exit the process with a failure code
}
// console.log("Using token: ",TOKEN);

const bot = new TelegramBot(TOKEN, {polling:true});
// TelegramBot - constructor function of class provided by node-telegram-bot-api
// { polling: true } → Means your bot will constantly check for new messages using long polling

// Listen for any message
// bot.on('message', (msg)=>{
//     console.log(msg);
//     console.log('message received from: ', msg.from.first_name);
//     console.log('message text data received: ', msg.text)
//     bot.sendMessage(msg.chat.id, `You said: ${msg.text}`); //if multiple users are interacting with our Bot, then uniquely identify and reply to user we need to pass (already generated) unique Chat Id as parameter
// });

// jo message receive hua hai, if uska .text=="write code" then below attached callback will be executed
// we are passing two parameters to .on() method, 1st is eventType and 2nd is callback & us callback ko messagedata kon provide karega? - that will be responsibilty of .on() method
// messagedata ke saath uski id bhi ati hai 
bot.on('message', (messagedata)=>{
    if(messagedata.text == 'write code'){
        bot.sendMessage(messagedata.chat.id, `Always do home work and write your own code!!`);
    }else{
        bot.sendMessage(messagedata.chat.id, `You prompted: ${messagedata.text}`);
    }
})

// if regular expression /\/start/ matches then attached callback will be executed
bot.onText(/\/start/, (msg)=>{ //if msg.text == /start then this callback will be executed 
    bot.sendMessage(msg.chat.id, `Welcome to telegramBot jarvis, how can i help you?`);
})

bot.onText(/\/help/, (data)=>{
    bot.sendMessage(data.chat.id, `welcome back , i am willing to help you!`);
})

bot.onText(/\/joke/, async (data)=>{ //we are making api call, that's why we made this callback function as async function
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');//this promise fulfills with response object
    console.log(response.data);
    const setup=response.data.setup;
    const punchline = response.data.punchline;
    bot.sendMessage(data.chat.id, `${setup}`)
    setTimeout(()=>{
        bot.sendMessage(data.chat.id, `${punchline}`); //sending punchline after 1sec
    }, 1000)
})

} catch (error) {
    console.error('Failed to initialise bot :', error.message);
    process.exit(1); // Exit the application with an error code
}