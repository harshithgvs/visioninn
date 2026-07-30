import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 1. Generate Full Resume with AI
app.post("/api/generate-resume", async (req, res) => {
  try {
    const { targetRole, experienceLevel, userBio, keySkills } = req.body;

    const prompt = `Generate a professional, ATS-optimized resume tailored for the position of "${targetRole || "Software Engineer"}" at experience level "${experienceLevel || "Mid-Level"}". 
User profile background: "${userBio || "Experienced developer passionate about building modern web applications."}".
Key skills to emphasize: "${keySkills || "JavaScript, React, Node.js, SQL, Problem Solving"}".

Provide realistic, high-impact quantifiable achievements (e.g., improved load time by 35%, increased conversion by 20%, reduced latency). Return a JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  year: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                },
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["fullName", "summary", "skills", "experience", "education"],
        },
      },
    });

    const resumeData = JSON.parse(response.text || "{}");
    res.json({ success: true, resume: resumeData });
  } catch (error: any) {
    console.error("Error generating resume:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate resume" });
  }
});

// 2. Enhance Resume Bullet Point
app.post("/api/enhance-bullet", async (req, res) => {
  try {
    const { draftBullet, targetRole } = req.body;
    const prompt = `Rewrite this draft resume bullet point to make it ATS-friendly, strong, action-oriented, and metric-driven for a ${targetRole || "professional"} role.
Draft bullet: "${draftBullet}"

Provide 3 variations:
1. Impact & Metrics focused
2. Leadership & Tech stack focused
3. Concise & Direct`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
              },
            },
          },
          required: ["variations"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, variations: data.variations || [] });
  } catch (error: any) {
    console.error("Error enhancing bullet:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to enhance bullet" });
  }
});

// 3. Generate Custom Learning Roadmap
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { courseTitle, targetGoal, durationWeeks } = req.body;
    const prompt = `Create a structured step-by-step learning roadmap for the course/skill: "${courseTitle}".
Target Goal: "${targetGoal || "Become job ready"}".
Estimated Total Duration: ${durationWeeks || 8} weeks.

Break it down into 4 to 6 logical phases. Each phase should contain 2-4 key actionable milestones/topics, with key concepts, estimated hours, and a mini practical project idea.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedWeeks: { type: Type.NUMBER },
            prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseTitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  topics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        topicTitle: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                        resourceType: { type: Type.STRING },
                      },
                    },
                  },
                  projectIdea: { type: Type.STRING },
                },
              },
            },
          },
          required: ["title", "description", "phases"],
        },
      },
    });

    const roadmapData = JSON.parse(response.text || "{}");
    res.json({ success: true, roadmap: roadmapData });
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate roadmap" });
  }
});

// 4. Generate Course Mock Test / Quiz
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { courseTopic, difficulty, questionCount } = req.body;
    const count = Math.min(Math.max(questionCount || 5, 3), 10);

    const prompt = `Generate a ${count}-question multiple choice mock test quiz for "${courseTopic || "JavaScript & Web Development"}".
Difficulty Level: ${difficulty || "Intermediate"}.

Each question must have exactly 4 options (A, B, C, D), 1 correct answer index (0, 1, 2, or 3), and a clear educational explanation of why the correct option is right.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  questionText: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctOptionIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  conceptCategory: { type: Type.STRING },
                },
              },
            },
          },
          required: ["quizTitle", "questions"],
        },
      },
    });

    const quizData = JSON.parse(response.text || "{}");
    res.json({ success: true, quiz: quizData });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate quiz" });
  }
});

// Vite & Static file serving setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
