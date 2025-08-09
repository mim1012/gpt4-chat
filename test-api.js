// API 키 테스트 스크립트
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
    try {
        console.log('Testing OpenAI API...');
        console.log('Using model:', process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
        
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say hello in Korean' }
            ],
            max_tokens: 100,
        });

        console.log('✅ API Test Successful!');
        console.log('Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ API Test Failed!');
        console.error('Error:', error.message);
        if (error.status === 401) {
            console.error('→ Invalid API key');
        } else if (error.status === 404) {
            console.error('→ Model not found or no access');
        } else if (error.status === 429) {
            console.error('→ Rate limit exceeded or quota exhausted');
        }
    }
}

testAPI();