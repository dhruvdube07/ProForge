import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function main() {
  try {
    const list = await groq.models.list();
    console.log('Available models:', list.data.map(m => m.id));
  } catch (err) {
    console.error('Error fetching models:', err);
  }
}
main();
