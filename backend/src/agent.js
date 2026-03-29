import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

// 1. Define the Graph State
export const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  filters: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  actionTaken: Annotation({
    reducer: (x, y) => y,
    default: () => null,
  }),
});

// 2. Define the Tool to control Frontend Filters
const updateFiltersTool = tool(
  async ({ query, workMode, jobType, datePosted, location, minScore, clearAll }) => {
    return "Filters updated.";
  },
  {
    name: "update_ui_filters",
    description:
      "Use this tool to update the frontend UI filters when the user asks to see specific types of jobs (e.g., remote, roles, locations, 24 hours), or high match scores (>70%), or clear filters.",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe("Search query for job title, skills, or role (e.g. 'React Node.js', 'ML PyTorch')"),
      workMode: z
        .string()
        .optional()
        .describe("The work mode (e.g. Remote, Hybrid, On-site, all)"),
      jobType: z
        .string()
        .optional()
        .describe(
          "The job type (e.g. Full-time, Part-time, Contract, Internship, all)",
        ),
      datePosted: z
        .string()
        .optional()
        .describe(
          "How recently the job was posted (e.g. day, week, month, all). Use 'day' for last 24 hours.",
        ),
      location: z
        .string()
        .optional()
        .describe("Specific city or region (e.g., Bangalore, Remote, India)"),
      minScore: z
        .number()
        .optional()
        .describe("Minimum match score required (e.g. 70 for high match scores only. Always set this to 70 if the user asks for high matches)"),
      clearAll: z
        .boolean()
        .optional()
        .describe("Set to true if the user wants to clear or reset all filters.")
    }),
  },
);

// 3. Initialize Model
const getModel = () => {
  if (process.env.GEMINI_API_KEY) {
    return new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-flash",
      temperature: 0,
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  if (process.env.OPENAI_API_KEY) {
    return new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  throw new Error("No AI provider keys configured.");
};

// 4. Define Nodes
async function callModel(state) {
  const model = getModel().bindTools([updateFiltersTool]);
  const response = await model.invoke([
    new SystemMessage(
      `You are Kunj, a helpful AI job search assistant. You can help users find jobs by understanding their natural language queries (e.g., 'Show me React developer jobs with Node.js', 'High match scores only'). You must ALWAYS use the update_ui_filters tool to update their search filters automatically when they ask for specific jobs, locations, timeframes, high match scores (set minScore to 70), or to clear filters. 

      You can also answer product help questions. Keep your responses short and friendly.
      App Knowledge / FAQ:
      - "Where can I see my applications?": Tell them they can view all tracked applications in the "Applications" tab on the left navigation bar.
      - "How do I upload my resume?": Tell them to click the "Upload Resume" or "Update Resume" button located at the bottom of the navigation sidebar. We accept PDF and TXT files.
      - "How does job matching work?": Explain that the AI analyzes their uploaded resume and compares it against job requirements. ONLY give this explanation if they ask HOW it works. If they say "High match scores only", use the update_ui_filters tool instead.`
    ),
    ...state.messages,
  ]);
  return { messages: [response] };
}

async function handleToolCalls(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  let newFilters = {};

  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    for (const toolCall of lastMessage.tool_calls) {
      if (toolCall.name === "update_ui_filters") {
        newFilters = toolCall.args;
      }
    }

    const finalMessage = new AIMessage({
      content:
        "I've updated your job filters based on your request. Take a look at the newly filtered jobs on your dashboard!",
    });

    return {
      messages: [finalMessage],
      filters: newFilters,
      actionTaken: "filter_update",
    };
  }
  return { actionTaken: null };
}

function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return END;
}

// 5. Build Graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", handleToolCalls)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    [END]: END,
  })
  .addEdge("tools", END);

const app = workflow.compile();

export async function runAgent(messageText) {
  try {
    const initialState = {
      messages: [new HumanMessage(messageText)],
      filters: {},
      actionTaken: null,
    };

    const result = await app.invoke(initialState);
    const lastMessage = result.messages[result.messages.length - 1];

    return {
      message:
        lastMessage.content ||
        "I've updated your filters to help you find that!",
      filters: result.filters,
      type: result.actionTaken === "filter_update" ? "filter_update" : "chat",
    };
  } catch (error) {
    console.error("Agent Execution Error (Invalid API Key):", error.message);

    // 🚀 SMART FALLBACK SYSTEM 🚀
    const text = messageText.toLowerCase();
    
    let fallbackFilters = {};
    let isFilterUpdate = false;

    // Check Filters FIRST (so "High match scores only" doesn't trigger the FAQ)
    // Extract Query
    if (text.includes("react")) { fallbackFilters.query = "React"; isFilterUpdate = true; }
    else if (text.includes("python")) { fallbackFilters.query = "Python"; isFilterUpdate = true; }
    else if (text.includes("node")) { fallbackFilters.query = "Node"; isFilterUpdate = true; }
    else if (text.includes("clear") || text.includes("reset")) { fallbackFilters.clearAll = true; isFilterUpdate = true; }

    // Extract Work Mode
    if (text.includes("remote")) { fallbackFilters.workMode = "remote"; isFilterUpdate = true; }
    else if (text.includes("hybrid")) { fallbackFilters.workMode = "hybrid"; isFilterUpdate = true; }

    // Extract Job Type
    if (text.includes("full time") || text.includes("full-time")) { fallbackFilters.jobType = "full-time"; isFilterUpdate = true; }

    // Extract Date Posted
    if (text.includes("24 hours") || text.includes("today")) { fallbackFilters.datePosted = "day"; isFilterUpdate = true; }
    else if (text.includes("week")) { fallbackFilters.datePosted = "week"; isFilterUpdate = true; }

    // Extract Match Score
    if ((text.includes("high match") || text.includes("match score") || text.includes("70")) && !text.includes("how")) {
      fallbackFilters.minScore = 70;
      isFilterUpdate = true;
    }

    // Extract Location
    if (text.includes("bangalore")) { fallbackFilters.location = "Bangalore"; isFilterUpdate = true; }

    if (isFilterUpdate) {
      return {
        message: "I've updated your filters to help you find those jobs!",
        filters: fallbackFilters,
        type: "filter_update",
      };
    }

    // FAQ Fallbacks (Checked LAST)
    if (text.includes("where") && (text.includes("applications") || text.includes("applied"))) {
      return {
        message: "You can view all tracked applications in the 'Applications' tab on the left navigation bar.",
        filters: {},
        type: "chat",
      };
    }
    if (text.includes("upload") && (text.includes("resume") || text.includes("cv"))) {
      return {
        message: "Click the 'Upload Resume' or 'Update Resume' button located at the bottom of the navigation sidebar. We accept PDF and TXT files.",
        filters: {},
        type: "chat",
      };
    }
    if (text.includes("how") && (text.includes("matching") || text.includes("match score"))) {
      return {
        message: "The AI analyzes your uploaded resume and compares it against job requirements. It calculates a score based on skill overlap (45%), experience level alignment (30%), and job title relevance (25%).",
        filters: {},
        type: "chat",
      };
    }

    // Default Fallback
    return {
      message: "I couldn't connect to my AI provider, but you can still ask me to 'Show me remote jobs', 'High match scores only', or 'Clear all filters' and I will update your UI manually!",
      filters: {},
      type: "chat",
    };
  }
}
