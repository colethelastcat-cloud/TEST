export async function getOpenAISolution(userInput) {
    // IMPORTANT: Paste your real OpenAI API Key here.
    const apiKey = "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";
    
    // Do not change this URL.
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    if (!apiKey || apiKey === "YOUR_REAL_OPENAI_API_KEY_GOES_HERE") {
        throw new Error("API Error: 401 - Missing or placeholder API key. Please add your key to api/openai.js.");
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides concise solutions."
                },
                {
                    role: "user",
                    content: userInput
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

