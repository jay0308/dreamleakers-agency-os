import axios from "axios";
import {
  ClientBrief,
  BrandStrategy,
  WebsiteSEOPlan,
  AgentResponse
} from "@/types";
import { safeParseJSON } from "@/utils/parseAgent";

const SYSTEM_PROMPT = `
You are the Website Strategy & SEO Lead at Dreamleakers,
a full-service digital agency based in Delhi NCR, India.

YOUR ONE JOB:
Using the client brief and brand strategy provided, create
a complete website plan with SEO and GEO optimization
built into every page from day one.

WHAT YOU MUST PRODUCE:

1. SITEMAP
List all pages the website needs.
Start with highest priority pages first.
Include both main pages and supporting pages.

2. PAGE BRIEFS
For each main page (max 6 pages) provide:
- Page name
- Purpose of the page
- Primary SEO keyword to target
- GEO keyword (conversational AI search phrase)
- Content brief (what the page must cover)

3. TECHNICAL SEO
Specific technical actions needed.
Be precise — not generic advice.

4. LOCAL SEO ACTIONS
Specific steps for India/local market visibility.
Include Google My Business, local citations, etc.

5. GEO OPTIMIZATION TIPS
How to optimize for AI search engines specifically:
ChatGPT, Perplexity, Google AI Overviews, Gemini.
Be specific and actionable.

6. BLOG TOPICS
8 blog post titles that will drive organic traffic.
Each must target a real search query Indians use.
Mix of SEO and GEO optimized topics.

OUTPUT RULES:
- sitemap: 8-12 page names as array
- pageBriefs: exactly 6 pages, all fields max 20 words
- technicalSEO: exactly 6 actions, each max 15 words
- localSEOActions: exactly 5 actions, each max 15 words
- geoOptimizationTips: exactly 5 tips, each max 20 words
- blogTopics: exactly 8 titles, each max 12 words

The very first character of your response must be {
The very last character of your response must be }

Return ONLY this exact JSON structure:

{
  "sitemap": [],
  "pageBriefs": [
    {
      "pageName": "",
      "purpose": "",
      "targetKeyword": "",
      "geoKeyword": "",
      "contentBrief": ""
    }
  ],
  "technicalSEO": [],
  "localSEOActions": [],
  "geoOptimizationTips": [],
  "blogTopics": []
}
`;

export const runWebsiteAgent = async (
  clientBrief: ClientBrief,
  brandStrategy: BrandStrategy
): Promise<AgentResponse<WebsiteSEOPlan>> => {

  const contextAsString = `
CLIENT IDENTITY:
Business Name: ${clientBrief?.businessName ?? ""}
Industry: ${clientBrief?.industry ?? ""}
Location: ${clientBrief?.location ?? ""}
Target Market: ${clientBrief?.targetMarket ?? ""}
Services: ${clientBrief?.servicesNeeded?.join(", ") ?? ""}
Target Audience: ${clientBrief?.targetAudience ?? ""}
Primary Goal: ${clientBrief?.primaryGoal ?? ""}
Current Digital Presence: ${clientBrief?.currentDigitalPresence ?? ""}

BRAND STRATEGY:
Brand Voice: ${brandStrategy?.brandVoice ?? ""}
UVP: ${brandStrategy?.uniqueValueProposition ?? ""}
Messaging Pillars: ${brandStrategy?.messagingPillars?.join(" | ") ?? ""}
Taglines: ${brandStrategy?.taglines?.join(" | ") ?? ""}
Key Messages: ${brandStrategy?.targetKeyMessages?.join(" | ") ?? ""}
  `.trim();

  try {
    const response = await axios.post("/api/agent", {
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contextAsString }],
      max_tokens: 4000
    });

    const rawText: string = response.data?.content?.[0]?.text ?? "";
    const parsed = safeParseJSON<WebsiteSEOPlan>(rawText);
    return { success: true, data: parsed };

  } catch (error) {
    const message = error instanceof Error
      ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};