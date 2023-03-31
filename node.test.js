
const openai = require('openai');
const assert = require('assert');

describe('OpenAI API', function() {
  it('should generate text using the Davinci Three model', function() {
    openai.apiKey = '<your-api-key>';
    const prompt = "Hello, world!";
    return openai.Completion.create({
      model: "text-davinci-003",
      prompt: prompt,
      maxTokens: 10,
    }).then(response => {
      assert.equal(response.choices[0].text, "Hi there!");
    });
  });
});





