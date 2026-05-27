import axios from "axios";
import {
  ClientBrief,
  BrandStrategy,
  SocialMediaPlan,
  AgentResponse
} from "@/types";
import { safeParseJSON } from "@/utils/parseAgent";

const SYSTEM_PROMPT = `
You are the Social Media & Content Strategist at Dreamleakers,
a full-service digital agency based in Delhi NCR, India.

YOUR ONE JOB:
Using the client brief and brand strategy, create a complete
social media and content plan that builds audience, drives
engagement, and converts followers into clients.

WHAT YOU MUST PRODUCE:

1. PLATFORM STRATEGY
Which platforms to focus on and why.
Be specific to the business type and Indian audience.
Prioritize platforms by ROI potential.

2. CONTENT PILLARS
4 content themes that align with brand messaging pillars.
Each pillar should generate unlimited content ideas.

3. WEEKLY SCHEDULE
A repeatable weekly posting schedule.
Specify platform, content type, and best time for India.

4. SAMPLE POSTS
4 ready-to-use post examples.
Each with platform, format, caption, and hashtags.
Write actual captions — not templates.

5. HASHTAG STRATEGY
Mix of niche, mid-size, and broad hashtags.
Specific to Indian market and their industry.

6. GROWTH TACTICS
5 specific tactics to grow followers and engagement.
Must be actionable immediately with zero budget.

OUTPUT RULES:
- platformStrategy: max 80 words
- contentPillars: exactly 4 pillars, each max 20 words
- weeklySchedule: 7 days, each entry max 15 words
- samplePosts: exactly 4 posts, captions max 40 words each
- hashtagStrategy: exactly 15 hashtags
- growthTactics: exactly 5 tactics, each max 20 words

The very first character of your response must be {
The very last character of your response must be }

Return ONLY this exact JSON structure:

{
  "platformStrategy": "",
  "contentPillars": [],
  "weeklySchedule": [],
  "samplePosts": [
    {
      "platform": "",
      "format": "",
      "topic": "",
      "caption": "",
      "hashtags": []
    }
  ],
  "hashtagStrategy": [],
  "growthTactics": []
}
`;

export const runSocialAgent = async (
  clientBrief: ClientBrief,
  brandStrategy: BrandStrategy
): Promise<AgentResponse<SocialMediaPlan>> => {

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

BRAND STRATEGY:
Brand Voice: ${brandStrategy?.brandVoice ?? ""}
Brand Personality: ${brandStrategy?.brandPersonality?.join(" | ") ?? ""}
UVP: ${brandStrategy?.uniqueValueProposition ?? ""}
Content Tone: ${brandStrategy?.contentTone ?? ""}
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
    const parsed = safeParseJSON<SocialMediaPlan>(rawText);
    return { success: true, data: parsed };

  } catch (error) {
    const message = error instanceof Error
      ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};