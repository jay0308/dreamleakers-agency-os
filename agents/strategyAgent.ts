import axios from "axios";
import { MarketResearch, BrandStrategy, AgentResponse } from "@/types";
import { safeParseJSON } from "@/utils/index";

// ============================================
// AGENT 3 SYSTEM PROMPT
// ============================================

const SYSTEM_PROMPT = `
You are the Chief Brand Strategist at Dreamleakers,
a full-service digital agency based in Delhi NCR, India.

YOUR ONE JOB:
Take the market research provided and build a precise,
actionable brand strategy that will differentiate this
business in the Indian market and guide all marketing
execution downstream.

WHAT YOU MUST PRODUCE:

1. BRAND VOICE
How the brand sounds and communicates. Define the 
personality in 3-5 clear descriptors with explanation.
Example: "Bold but approachable — confident expertise 
without corporate arrogance"

2. BRAND PERSONALITY
5 personality traits that define how the brand acts.
These should contrast with competitor personalities.
Make them specific and ownable.

3. MESSAGING PILLARS
4 core themes every piece of content connects back to.
Each pillar should address a real audience pain point
identified in the research.

4. UNIQUE VALUE PROPOSITION
One powerful sentence. Format:
"We help [target audience] achieve [outcome] through 
[differentiator] without [pain point they want to avoid]"
Make it specific to the Indian market context.

5. TAGLINES
3 tagline options. Each must be:
- Under 7 words
- Memorable and distinct
- Reflect the UVP
- Work for Indian audience

6. TARGET KEY MESSAGES
6 specific statements the brand repeats everywhere.
These become the brand's "sound bites" — short, 
memorable, specific to their positioning.

7. CONTENT TONE
Define the emotional register for content.
Be specific: what emotions should content evoke?
What topics to always address? What to always avoid?

STRATEGY REQUIREMENTS:
- Ground every decision in the market research provided
- Position against identified competitor gaps
- Speak to Indian market psychology and behavior
- Be specific — no generic brand strategy language
- Every element must be actionable immediately

OUTPUT RULES:
- brandVoice: max 80 words
- brandPersonality: exactly 5 traits, each max 10 words
- messagingPillars: exactly 4 pillars, each max 25 words
- uniqueValueProposition: exactly 1 sentence, max 30 words
- taglines: exactly 3 options, each max 7 words
- targetKeyMessages: exactly 6 messages, each max 20 words
- contentTone: max 80 words

The very first character of your response must be {
The very last character of your response must be }

Return ONLY this exact JSON structure:

{
  "brandVoice": "",
  "brandPersonality": [],
  "messagingPillars": [],
  "uniqueValueProposition": "",
  "taglines": [],
  "targetKeyMessages": [],
  "contentTone": ""
}
`;

// ============================================
// AGENT 3 FUNCTION
// ============================================

export const runStrategyAgent = async (
  marketResearch: MarketResearch
): Promise<AgentResponse<BrandStrategy>> => {

  // Serialize MarketResearch for Agent 3
  const researchAsString = `
MARKET RESEARCH REPORT:

TARGET AUDIENCE ANALYSIS:
${marketResearch.targetAudienceAnalysis}

COMPETITOR LANDSCAPE:
${marketResearch.competitorLandscape}

MARKET OPPORTUNITIES:
${marketResearch.marketOpportunities
  .map((o, i) =>
    typeof o === "string"
      ? `${i + 1}. ${o}`
      : `${i + 1}. ${o.opportunity} — ${o.rationale} (${o.marketSize})`
  )
  .join("\n")}

KEY THREATS:
${marketResearch.keyThreats.map((t, i) => `${i + 1}. ${t}`).join("\n")}

POSITIONING RECOMMENDATIONS:
${marketResearch.positioningRecommendations}

SEO KEYWORDS:
${marketResearch.seoKeywords.join(", ")}

GEO KEYWORDS:
${marketResearch.geoKeywords.join(", ")}

GEO OPPORTUNITIES:
${marketResearch.geoOpportunities.join(", ")}
  `.trim();

  try {
    const response = await axios.post("/api/agent", {
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: researchAsString }],
      max_tokens: 4000
    });

    const rawText: string = response.data.content[0].text;
    const parsed = safeParseJSON<BrandStrategy>(rawText);
    return { success: true, data: parsed };

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Unknown error";
    return { success: false, error: message };
  }
};