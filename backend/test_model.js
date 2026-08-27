import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testModel(modelId) {
  console.log(`Testing model: ${modelId}...`);
  try {
    const comp = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Output a valid JSON object with a single key "status" set to "success".' }],
      model: modelId,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    console.log(`  Success! Response:`, comp.choices[0]?.message?.content);
    return true;
  } catch (err) {
    console.error(`  Failed:`, err.message);
    return false;
  }
}

async function main() {
  const models = ['qwen/qwen3.8-27b', 'groq/compound', 'openai/gpt-oss-120b', 'canopylabs/orpheus-v1-english'];
  for (const m of models) {
    const ok = await testModel(m);
    if (ok) {
      console.log(`>> RECOMMENDED MODEL: ${m}`);
      break;
    }
  }
}
main();
