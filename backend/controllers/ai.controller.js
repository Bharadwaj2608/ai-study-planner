import Anthropic from "@anthropic-ai/sdk";
import StudyPlan from "../models/StudyPlan.js";

export const AI_MODEL = "claude-sonnet-4-20250514";

let _client;
function getClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

const SYSTEM_PROMPT = `You are an expert academic coach. Given a learner's subject, goal,
target exam date, daily study budget and current level, produce a realistic, day-by-day study
plan. Output STRICT JSON matching the provided schema. Never include prose outside JSON.`;

const planTool = {
  name: "emit_study_plan",
  description: "Emit a structured study plan",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            topic: { type: "string" },
            durationMinutes: { type: "number" },
            resources: { type: "array", items: { type: "string" } },
          },
          required: ["day", "topic", "durationMinutes"],
        },
      },
    },
    required: ["title", "tasks"],
  },
};

export async function generatePlan(req, res, next) {
  try {
    const { subject, goal, examDate, hoursPerDay = 2, level = "beginner", save = true } = req.body;

    if (!subject || !goal) {
      return res.status(400).json({ message: "subject and goal are required" });
    }

    const userMsg = `Subject: ${subject}
Goal: ${goal}
Exam date: ${examDate || "not specified"}
Hours per day: ${hoursPerDay}
Current level: ${level}

Build a focused day-by-day plan up to the exam date (or 14 days if no date).
Each task: day number, single clear topic, durationMinutes (<= hoursPerDay*60),
and 1-3 high-quality resources (URLs or book chapters).`;

    const response = await getClient().messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userMsg },
      ],
      tools: [planTool],
      tool_choice: { type: "tool", name: "emit_study_plan" },
    });

    const call = response.content.find((b) => b.type === "tool_use");
    if (!call) return res.status(502).json({ message: "AI did not return a structured plan" });

    const parsed = call.input;

    if (!save) return res.json({ preview: parsed });

    const plan = await StudyPlan.create({
      user: req.user._id,
      title: parsed.title,
      subject,
      goal,
      examDate: examDate || undefined,
      hoursPerDay,
      level,
      tasks: parsed.tasks,
    });

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
}