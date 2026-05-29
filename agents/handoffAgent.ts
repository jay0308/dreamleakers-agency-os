import axios from "axios";
import {
  ClientBrief,
  MarketResearch,
  BrandStrategy,
  WebsiteSEOPlan,
  SocialMediaPlan,
  PerformanceMarketingPlan,
  HandoffPackage,
  AgentResponse
} from "@/types";
import { safeParseJSON } from "@/utils/parseAgent";

// ============================================
// SYSTEM PROMPT
// ============================================

const SYSTEM_PROMPT = `
You are the Delivery Lead at Dreamleakers,
a full-service digital agency based in Delhi NCR, India.

YOUR ONE JOB:
Take the complete pipeline output for a client and compile
it into three precise, actionable handoff documents:
1. Design Brief — for the designer
2. Dev Spec — for the developer
3. Client Report — for the client

DESIGN BRIEF RULES:
- Visual direction must be specific and actionable
- Color palette should suggest actual hex codes based on
  brand personality (not generic colors)
- Typography must name specific Google Fonts that match
  the brand voice
- Key visual elements should be specific UI components
- Page layout notes must reference actual pages from sitemap
- Mood and feel should reference real design references
- Assets needed should be a complete production checklist

DEV SPEC RULES:
- Tech stack must be specific (Next.js, Tailwind, etc.)
- Pages and routes must match the sitemap exactly
- SEO checklist must be implementable line items
- Performance requirements must have specific targets
  (e.g. "LCP under 2.5s", "100 Lighthouse score")
- Integrations must name specific tools (Razorpay, etc.)
- Schema markup must name specific schema types needed
- Launch checklist must be ordered and complete

CLIENT REPORT RULES:
- Written in the brand voice defined in strategy
- Executive summary must be inspiring but grounded
- No technical jargon — client-friendly language
- Digital roadmap must have clear phases with timelines
- Expected outcomes must have specific metrics
- Next steps must be immediately actionable
- Investment breakdown must reflect their budget

OUTPUT RULES:
- All string fields max 100 words
- All array fields max 8 items each
- Be specific, not generic
- Every item must be immediately actionable

The very first character of your response must be {
The very last character of your response must be }

Return ONLY this exact JSON:

{
  "designBrief": {
    "visualDirection": "",
    "colorPalette": [],
    "typographyDirection": "",
    "keyVisualElements": [],
    "pageLayoutNotes": [],
    "moodAndFeel": "",
    "assetsNeeded": []
  },
  "devSpec": {
    "techStackRecommendation": "",
    "pagesAndRoutes": [],
    "seoImplementationChecklist": [],
    "performanceRequirements": [],
    "integrationsNeeded": [],
    "schemaMarkup": [],
    "launchChecklist": []
  },
  "clientReport": {
    "executiveSummary": "",
    "marketPosition": "",
    "brandStrategy": "",
    "digitalRoadmap": [],
    "expectedOutcomes": [],
    "nextSteps": [],
    "investmentBreakdown": ""
  }
}
`;

// ============================================
// AGENT 7 FUNCTION
// ============================================

export const runHandoffAgent = async (
  clientBrief: ClientBrief,
  marketResearch: MarketResearch,
  brandStrategy: BrandStrategy,
  websitePlan: WebsiteSEOPlan,
  socialPlan: SocialMediaPlan,
  performancePlan: PerformanceMarketingPlan
): Promise<AgentResponse<HandoffPackage>> => {

  const contextAsString = `
CLIENT IDENTITY:
Business: ${clientBrief.businessName}
Industry: ${clientBrief.industry}
Location: ${clientBrief.location}
Services: ${(clientBrief.servicesNeeded ?? []).join(", ")}
Audience: ${clientBrief.targetAudience}
Goal: ${clientBrief.primaryGoal}
Budget: ${clientBrief.budget} (${clientBrief.budgetCategory})

BRAND STRATEGY:
Voice: ${brandStrategy.brandVoice}
UVP: ${brandStrategy.uniqueValueProposition}
Personality: ${(brandStrategy.brandPersonality ?? []).join(", ")}
Taglines: ${(brandStrategy.taglines ?? []).join(" | ")}
Pillars: ${(brandStrategy.messagingPillars ?? []).join(" | ")}
Tone: ${brandStrategy.contentTone}

WEBSITE PLAN:
Sitemap: ${(websitePlan.sitemap ?? []).join(", ")}
Technical SEO: ${(websitePlan.technicalSEO ?? []).join(", ")}
Blog Topics: ${(websitePlan.blogTopics ?? []).slice(0, 4).join(", ")}
GEO Tips: ${(websitePlan.geoOptimizationTips ?? []).join(", ")}

SOCIAL MEDIA:
Platform Strategy: ${socialPlan.platformStrategy}
Content Pillars: ${(socialPlan.contentPillars ?? []).join(", ")}
Growth Tactics: ${(socialPlan.growthTactics ?? []).join(", ")}

PERFORMANCE MARKETING:
Channel Strategy: ${performancePlan.channelStrategy}
Budget Allocation: ${(performancePlan.budgetAllocation ?? []).join(", ")}
KPIs: ${(performancePlan.kpis ?? []).join(", ")}
30 Day Plan: ${(performancePlan.thirtyDayPlan ?? []).join(" | ")}

MARKET POSITIONING:
${marketResearch.positioningRecommendations}
SEO Keywords: ${(marketResearch.seoKeywords ?? []).slice(0, 5).join(", ")}
GEO Keywords: ${(marketResearch.geoKeywords ?? []).slice(0, 4).join(", ")}
  `.trim();

  try {
    const response = await axios.post("/api/agent", {
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: contextAsString }],
      max_tokens: 6000
    });

    const rawText: string = response.data.content[0].text;
    const parsed = safeParseJSON<HandoffPackage>(rawText);
    return { success: true, data: parsed };

  } catch (error) {
    const message = error instanceof Error
      ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};