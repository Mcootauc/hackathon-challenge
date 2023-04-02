import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs' // import the fs module
config();

let result;

//processes the api key from the .env file
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}))

// read the contents of console-output.txt
const outputContents = fs.readFileSync('console-out.txt', 'utf8');

//constant errors holds an array with the line numbers of the errors
const errors = findErrorCommands(outputContents);

//first call to chatGPT to get the commands excuted that caused the errors
const prompt1 = `What are the commands executed that caused the errors in the text: \n${outputContents}, near the lines at: ${errors}`;
callChatGPT(prompt1)
    .then((res) => {
        let suggestionDict = {};
        let commandsDictArray = [];

        //splits the result into an array of commands
        const commands = result.split('\n').filter(Boolean).slice(2);

        //gets rid of the numbers preciding the commands
        const commandsWithoutNumbers = commands.map(command => command.substring(command.indexOf(' ') + 1).trim());

        //creates a dictionary for each command and pushes it into an array
        commandsWithoutNumbers.forEach((command) => {
            let commandDict = {
                "command_executed": command,
            };
            commandsDictArray.push(commandDict);
        });

        //creates a suggestion dictionary for the array of commands
        suggestionDict = {"suggestions": commandsDictArray};

        //writes the dictionary to the outputs.json file
        const commandsJson = JSON.stringify(suggestionDict, null, 4);
        fs.writeFile('outputs.json', commandsJson, (err) => {
            if (err) {
                console.log("Error writing file:", err);
            } else {
                console.log("outputs.json file was created");
            }
        });
    })
    .catch((err) => console.error(err));

const jsonData = fs.readFileSync('outputs.json');
const data = JSON.parse(jsonData);

// Access the values of the `command_executed` key
const commands = data.suggestions.map((item) => item.command_executed);

let i = 0;
//second call to chatGPT to get the error messages
commands.forEach((command) => {
    const prompt2 = `What are the error messages that follow this command: \n${command}, in the text: \n${outputContents}`;
    callChatGPT(prompt2)
    .then((res) => {
        //removes the new line characters from the result
        result = result.replace(/\n/g, "");
        data.suggestions[i++]["error"] = result.trim();
        let updatedJsonData = JSON.stringify(data, null, 4);
        fs.writeFileSync('outputs.json', updatedJsonData);
    })
    .catch((err) => console.error(err));
});

// Access the values of the `error` key
const errorInDict = data.suggestions.map((item) => item.error);

let j = 0;
let k = 0;
//third call to chatGPT to get the prompt messages
errorInDict.forEach((error) => {
    let prompt3 = `Can you please help me understand and assist me in solving this error?: \n${error}`;
    callChatGPT(prompt3)
    .then((res) => {
        //add prompt to the json file
        prompt3 = prompt3.replace(/\n/g, "");
        data.suggestions[j++]["prompt"] = prompt3.trim();

        //add the output to the json file
        result = result.replace(/\n/g, "");
        data.suggestions[k++]["output"] = result.trim();

        let updatedJsonData = JSON.stringify(data, null, 4);
        fs.writeFileSync('outputs.json', updatedJsonData);
    })
    .catch((err) => console.error(err));
});

//creation of model.json file
const settings = {
    "model": "text-davinci-003",
    "prompt": "prompt",
    "temperature": 0.7,
    "max_tokens": 100,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
};
const modelString = JSON.stringify(settings, null, 4);
fs.writeFile("model.json", modelString, (err) => {
    if (err) {
        console.log("Error writing file:", err);
    } else {
        console.log("model.json file was created");
    }
});

// function to find the lines with errors by searching for the word error or exception
function findErrorCommands(fileContents) {
    const lines = fileContents.split('\n');
    const errorLines = [];
  
    lines.forEach((line, index) => {
        if (line.match(/error|exception/i)) {
            errorLines.push(index + 1);
        }
    });
    return errorLines;
}

// function to call the openai api
function callChatGPT(prompt) {
    return new Promise((resolve, reject) => {
      openai
        .createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        .then((res) => {
            result = res.data.choices[0].text;
            resolve(res);
        })
        .catch((err) => reject(err));
    });
}