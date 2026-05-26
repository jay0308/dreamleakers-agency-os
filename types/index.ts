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
// PIPELINE — Full State Type
// ============================================

export interface PipelineState {
    clientBrief: ClientBrief | null;
    marketResearch: MarketResearch | null;
    brandStrategy: BrandStrategy | null;
    currentStage: "idle" | "intake" | "research" | "strategy" | "complete";
    isLoading: boolean;
    error: string | null;
}