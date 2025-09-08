export async function getOpenAISolution(userInput, imageBase64) {
    // NOTE: If this key still fails, you MUST generate a new one from the OpenAI website.
    const apiKey = "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";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    // Build the content array for the API request
    const content = [{ type: "text", text: userInput || "Describe this image" }];
    if (imageBase64) {
        content.push({
            type: "image_url",
            image_url: {
                "url": imageBase64,
            },
        });
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Upgraded model
                messages: [{ 
                    role: "user", 
                    content: content // Using the new multi-part content
                }],
                max_tokens: 800 // Added max_tokens
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}

