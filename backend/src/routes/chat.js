import { runAgent } from "../agent.js";

export default async function chatRoutes(fastify) {
  fastify.post("/", async (request, reply) => {
    try {
      const { message } = request.body;
      const userId = request.query.userId || "default";

      if (!message || message.trim().length === 0) {
        return reply.status(400).send({ error: "Message is required" });
      }

      // Process via mandatory LangGraph Agent workflow
      const agentResult = await runAgent(message);

      return {
        success: true,
        response: {
          type: agentResult.type,
          message: agentResult.message,
          filters: agentResult.filters || {},
          jobs: [], // Jobs are handled reactively by frontend filter updates
        },
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: "Failed to process message" });
    }
  });

  // Get suggested prompts
  fastify.get("/suggestions", async (request, reply) => {
    const suggestions = [
      { text: "Show me remote React jobs", category: "search" },
      { text: "Find roles in Bangalore", category: "search" },
      { text: "High match scores only", category: "match" },
      { text: "Clear all filters", category: "action" },
      { text: "Where do I see my applications?", category: "help" },
      { text: "How do I upload my resume?", category: "help" },
      { text: "How does matching work?", category: "help" },
    ];
    return { suggestions };
  });
}
