export const parseAIResponse = (content: string) => {
    if (!content) return null;

    // Try to find a JSON block inside the response
    // This matches anything that starts with '{' and ends with '}' even if multiple lines
    const jsonMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
        console.warn("No JSON block found in AI response.");
        return null;
    }

    // Extract the inner JSON string
    const jsonString = jsonMatch[1] ? jsonMatch[1].trim() : jsonMatch[0].trim();

    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse AI JSON:", error);
        console.log("Raw JSON string:", jsonString);
        return null;
    }
};