// ============================================
// AGENT 1 — Types
// ============================================

export type RawClientInput = string;

export interface ClientBrief {
  businessName: string;
  industry: string;
  location: string;
  targetMarket: string;
  servicesNeeded: string[];
  targetAudience: string;
  budget: string;
  budgetCategory: "low" | "mid" | "high";
  primaryGoal: string;
  currentDigitalPresence: string;
  competitors: string[];
  timeline: string;
  additionalNotes: string;
}

// ============================================
// AGENT 2 — Types
// ============================================

export interface MarketOpportunity {
  opportunity: string;
  rationale: string;
  marketSize: string;
}

export interface MarketResearch {
  targetAudienceAnalysis: string;
  competitorLandscape: string;
  marketOpportunities: MarketOpportunity[];  // ← updated
  keyThreats: string[];
  positioningRecommendations: string;
  seoKeywords: string[];
  geoKeywords: string[];
  geoOpportunities: string[];
}

// ============================================
// AGENT 3 — Types
// ============================================

export interface BrandStrategy {
  brandVoice: string;
  brandPersonality: string[];
  messagingPillars: string[];
  uniqueValueProposition: string;
  taglines: string[];
  targetKeyMessages: string[];
  contentTone: string;
}

// ============================================
// SHARED — Generic Agent Response Wrapper
// ============================================

export interface AgentResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// AGENT 4 — Website & SEO Agent
// ============================================

export interface PageBrief {
  pageName: string;
  purpose: string;
  targetKeyword: string;
  geoKeyword: string;
  contentBrief: string;
}

export interface WebsiteSEOPlan {
  sitemap: string[];
  pageBriefs: PageBrief[];
  technicalSEO: string[];
  localSEOActions: string[];
  geoOptimizationTips: string[];
  blogTopics: string[];
}

// ============================================
// AGENT 5 — Social Media & Content Agent
// ============================================

export interface ContentPost {
  platform: string;
  format: string;
  topic: string;
  caption: string;
  hashtags: string[];
}

export interface SocialMediaPlan {
  platformStrategy: string;
  contentPillars: string[];
  weeklySchedule: string[];
  samplePosts: ContentPost[];
  hashtagStrategy: string[];
  growthTactics: string[];
}

// ============================================
// AGENT 6 — Performance Marketing Agent
// ============================================

export interface AdCampaign {
  campaignName: string;
  platform: string;
  objective: string;
  targetAudience: string;
  adCopy: string;
  budget: string;
}

export interface PerformanceMarketingPlan {
  channelStrategy: string;
  campaigns: AdCampaign[];
  audienceSegments: string[];
  budgetAllocation: string[];
  kpis: string[];
  thirtyDayPlan: string[];
}

// ============================================
// UPDATED PIPELINE STATE
// ============================================

export interface PipelineState {
  clientBrief: ClientBrief | null;
  marketResearch: MarketResearch | null;
  brandStrategy: BrandStrategy | null;
  websiteSEOPlan: WebsiteSEOPlan | null;
  socialMediaPlan: SocialMediaPlan | null;
  performancePlan: PerformanceMarketingPlan | null;
  currentStage: "idle" | "intake" | "research" | "strategy" | "parallel" | "complete";
  isLoading: boolean;
  error: string | null;
}

// ============================================
// AGENT 7 — Delivery & Handoff
// ============================================

export interface DesignBrief {
  visualDirection: string;
  colorPalette: string[];
  typographyDirection: string;
  keyVisualElements: string[];
  pageLayoutNotes: string[];
  moodAndFeel: string;
  assetsNeeded: string[];
}

export interface DevSpec {
  techStackRecommendation: string;
  pagesAndRoutes: string[];
  seoImplementationChecklist: string[];
  performanceRequirements: string[];
  integrationsNeeded: string[];
  schemaMarkup: string[];
  launchChecklist: string[];
}

export interface ClientReport {
  executiveSummary: string;
  marketPosition: string;
  brandStrategy: string;
  digitalRoadmap: string[];
  expectedOutcomes: string[];
  nextSteps: string[];
  investmentBreakdown: string;
}

export interface HandoffPackage {
  designBrief: DesignBrief;
  devSpec: DevSpec;
  clientReport: ClientReport;
}