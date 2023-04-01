import { Configuration, OpenAIApi } from 'openai'; // import the openai module
import fs from 'fs' // import the fs module

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// read the contents of output.txt
const outputText = fs.readFileSync('console-out.txt', 'utf8');

// set up the prompt
const prompt = `Please read the following text:\n${outputText}`;

// use the OpenAI API to generate the response
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  temperature: 0.6,
}).then(response => {
  console.log(response.choices[0].text); // print the response text
}).catch(err => {
  console.error(err); // handle any errors
});


