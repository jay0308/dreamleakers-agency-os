import axios from "axios";
import {
  ClientBrief,
  MarketResearch,
  BrandStrategy,
  PerformanceMarketingPlan,
  AgentResponse
} from "@/types";
import { safeParseJSON } from "@/utils/parseAgent";

const SYSTEM_PROMPT = `
You are the Performance Marketing Lead at Dreamleakers,
a full-service digital agency based in Delhi NCR, India.

YOUR ONE JOB:
Using the client brief, market research, and brand strategy,
create a complete performance marketing plan that generates
measurable leads and revenue within 30 days.

WHAT YOU MUST PRODUCE:

1. CHANNEL STRATEGY
Which paid channels to use and why.
Be specific to the budget and Indian market.
Prioritize by ROI potential for their industry.

2. AD CAMPAIGNS
3 specific campaign concepts ready to launch.
Each with platform, objective, audience, and copy.
Write actual ad copy — not placeholders.

3. AUDIENCE SEGMENTS
5 specific audience segments to target.
Include demographics, interests, and behaviors.
Be specific to Indian platforms (Meta, Google).

4. BUDGET ALLOCATION
How to split the monthly budget across channels.
Give percentages and reasoning.
Be specific to their budget range.

5. KPIS
6 specific metrics to track success.
Include benchmarks relevant to Indian market.

6. 30 DAY PLAN
Week by week action plan for first 30 days.
Specific tasks, not general advice.

OUTPUT RULES:
- channelStrategy: max 80 words
- campaigns: exactly 3 campaigns, all fields max 25 words
- audienceSegments: exactly 5 segments, each max 20 words
- budgetAllocation: exactly 4 line items with percentages
- kpis: exactly 6 metrics with Indian benchmarks
- thirtyDayPlan: exactly 4 weeks, each max 30 words

The very first character of your response must be {
The very last character of your response must be }

Return ONLY this exact JSON structure:

{
  "channelStrategy": "",
  "campaigns": [
    {
      "campaignName": "",
      "platform": "",
      "objective": "",
      "targetAudience": "",
      "adCopy": "",
      "budget": ""
    }
  ],
  "audienceSegments": [],
  "budgetAllocation": [],
  "kpis": [],
  "thirtyDayPlan": []
}
`;

export const runPerformanceAgent = async (
  clientBrief: ClientBrief,
  marketResearch: MarketResearch,
  brandStrategy: BrandStrategy
): Promise<AgentResponse<PerformanceMarketingPlan>> => {

  const contextAsString = `
CLIENT IDENTITY:
Business Name: ${clientBrief?.businessName ?? ""}
Industry: ${clientBrief?.industry ?? ""}
Location: ${clientBrief?.location ?? ""}
Target Market: ${clientBrief?.targetMarket ?? ""}
Services: ${clientBrief?.servicesNeeded?.join(", ") ?? ""}
Target Audience: ${clientBrief?.targetAudience ?? ""}
Primary Goal: ${clientBrief?.primaryGoal ?? ""}
Budget: ${clientBrief?.budget ?? ""} (${clientBrief?.budgetCategory ?? ""})
Competitors: ${clientBrief?.competitors?.join(", ") ?? ""}

MARKET RESEARCH SUMMARY:
Opportunities: ${(marketResearch?.marketOpportunities ?? [])
  .map(o => typeof o === "string" ? o : o?.opportunity ?? "")
  .join(", ")}
Key Threats: ${marketResearch?.keyThreats?.join(", ") ?? ""}
Positioning: ${marketResearch?.positioningRecommendations ?? ""}
SEO Keywords: ${marketResearch?.seoKeywords?.join(", ") ?? ""}

BRAND STRATEGY:
UVP: ${brandStrategy?.uniqueValueProposition ?? ""}
Brand Voice: ${brandStrategy?.brandVoice ?? ""}
Key Messages: ${brandStrategy?.targetKeyMessages?.join(" | ") ?? ""}
Taglines: ${brandStrategy?.taglines?.join(" | ") ?? ""}
  `.trim();

  try {
    const response = await axios.post("/api/agent", {
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contextAsString }],
      max_tokens: 4000
    });

    const rawText: string = response.data?.content?.[0]?.text ?? "";
    const parsed = safeParseJSON<PerformanceMarketingPlan>(rawText);
    return { success: true, data: parsed };

  } catch (error) {
    const message = error instanceof Error
      ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};