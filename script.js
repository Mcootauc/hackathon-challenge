import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs' // import the fs module
config();

//processes the api key from the .env file
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}))

// read the contents of console-output.txt
const outputText = fs.readFileSync('console-out.txt', 'utf8');

// set up the prompt
const prompt1 = `Can you find the error commands in this text and show them to me?: \n${outputText}`;

callChatGPT(prompt1);

// function to call the openai api
function callChatGPT(prompt) {
    openai
    .createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    }).then(res => {
        console.log(res.data.choices[0].text)
    })
}

// const myDict = {"suggestions": [{  
//         "command_executed": "command",
//         "error": "error message",
//         "prompt": "What is fed to OpenAI (codex model performs well with code)",
//         "output": "Output from OpenAI" 
//     },
//     {  
//         "command_executed": "command",
//         "error": "error message",
//         "prompt": "What is fed to OpenAI (codex model performs well with code)",
//         "output": "Output from OpenAI" 
//     }] 
// };
// const myJson = JSON.stringify(myDict, null, 2);

// fs.writeFile('myDict.json', myJson, (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
// });

// // sets up the prompt
// const userInterface = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// //starts the prompt and loops it
// userInterface.prompt()
// userInterface.on('line', async input => { 
//     const res = await openai
//     .createCompletion({
//     model: "text-davinci-003",
//     prompt: input,
//     temperature: 0.7,
//     max_tokens: 100,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     })
//     console.log(res.data.choices[0].text)
//     userInterface.prompt()
// })