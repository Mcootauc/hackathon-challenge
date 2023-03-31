const openai = require('openai');
const prompt = "What is the meaning of life?";
const apiKey = "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";
openai.apiKey = apiKey;
openai.Completion.create({
  model: "text-davinci-003",
  prompt: prompt,
  maxTokens: 50,
}).then(response => {
  console.log(response.choices[0].text);
}).catch(error => {
  console.error(error);
});