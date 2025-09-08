export async function getOpenAISolution(userInput, imageBase64) {
    // NOTE: This is the newest key provided.
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

