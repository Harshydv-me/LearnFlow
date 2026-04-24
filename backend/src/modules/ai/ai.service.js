import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateTaskContent(
  taskTitle,
  taskDescription,
  topicTitle,
  skillName
) {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
You are an expert programming instructor creating a lesson for a learner
on the LearnFlow platform.

Skill: ${skillName}
Topic: ${topicTitle}
Task: ${taskTitle}
Task Description: ${taskDescription}

Generate a complete, engaging lesson for this task.
The learner is a beginner to intermediate developer.
Be clear, practical, and use real code examples.

Respond in this EXACT JSON format and nothing else:
{
  "explanation": "A thorough 3-5 paragraph explanation of the concept.
    Use simple language. Build from basics to practical application.
    Do not use markdown inside this string — plain text only.",
  "codeExamples": [
    {
      "title": "Short title for this example",
      "language": "javascript",
      "code": "// actual runnable code here\nconsole.log('example')",
      "explanation": "One sentence explaining what this code demonstrates."
    }
  ],
  "keyTakeaways": [
    "First key thing to remember",
    "Second key thing to remember",
    "Third key thing to remember"
  ],
  "proTip": "One advanced insight or common mistake to avoid."
}

Rules:
- codeExamples must have 2-3 items
- keyTakeaways must have exactly 3 items
- All code must be real, working, correctly indented code
- Use the correct language for the skill:
    javascript → Web Development, DSA
    sql        → Databases
    bash/yaml  → DevOps
    plaintext  → System Design concepts
- Respond ONLY with the raw JSON object
- Do NOT wrap in markdown code fences
- Do NOT add any text before or after the JSON
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
    text = text.replace(/```\s*$/i, "").trim();

    const parsed = JSON.parse(text);

    if (
      !parsed.explanation ||
      !Array.isArray(parsed.codeExamples) ||
      !Array.isArray(parsed.keyTakeaways) ||
      !parsed.proTip
    ) {
      throw new Error("AI response missing required fields");
    }

    if (parsed.keyTakeaways.length < 3) {
      while (parsed.keyTakeaways.length < 3) {
        parsed.keyTakeaways.push("Practice this concept regularly.");
      }
    }
    parsed.keyTakeaways = parsed.keyTakeaways.slice(0, 3);

    if (parsed.codeExamples.length === 0) {
      throw new Error("AI response has no code examples");
    }
    parsed.codeExamples = parsed.codeExamples.slice(0, 3);

    return parsed;
  } catch (error) {
    console.error("Gemini API error:", error.message);

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON");
    }

    throw error;
  }
}
