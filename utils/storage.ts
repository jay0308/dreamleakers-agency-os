import {
    ClientBrief,
    MarketResearch,
    BrandStrategy,
    WebsiteSEOPlan,
    SocialMediaPlan,
    PerformanceMarketingPlan
  } from "@/types";
  
  // ============================================
  // STORAGE KEYS
  // ============================================
  
  const KEYS = {
    clientBrief: "dl_agent1_clientBrief",
    marketResearch: "dl_agent2_marketResearch",
    brandStrategy: "dl_agent3_brandStrategy",
    websitePlan: "dl_agent4_websitePlan",
    socialPlan: "dl_agent5_socialPlan",
    performancePlan: "dl_agent6_performancePlan",
    rawInput: "dl_rawInput",
    lastRun: "dl_lastRun"
  } as const;
  
  // ============================================
  // PIPELINE STATE TYPE
  // ============================================
  
  export interface PersistedPipelineState {
    rawInput: string | null;
    clientBrief: ClientBrief | null;
    marketResearch: MarketResearch | null;
    brandStrategy: BrandStrategy | null;
    websitePlan: WebsiteSEOPlan | null;
    socialPlan: SocialMediaPlan | null;
    performancePlan: PerformanceMarketingPlan | null;
    lastRun: string | null;
  }
  
  // ============================================
  // SAVE FUNCTIONS — call after each agent
  // ============================================
  
  export const saveRawInput = (input: string) => {
    localStorage.setItem(KEYS.rawInput, input);
  };
  
  export const saveClientBrief = (data: ClientBrief) => {
    localStorage.setItem(KEYS.clientBrief, JSON.stringify(data));
    localStorage.setItem(KEYS.lastRun, new Date().toISOString());
  };
  
  export const saveMarketResearch = (data: MarketResearch) => {
    localStorage.setItem(KEYS.marketResearch, JSON.stringify(data));
  };
  
  export const saveBrandStrategy = (data: BrandStrategy) => {
    localStorage.setItem(KEYS.brandStrategy, JSON.stringify(data));
  };
  
  export const saveWebsitePlan = (data: WebsiteSEOPlan) => {
    localStorage.setItem(KEYS.websitePlan, JSON.stringify(data));
  };
  
  export const saveSocialPlan = (data: SocialMediaPlan) => {
    localStorage.setItem(KEYS.socialPlan, JSON.stringify(data));
  };
  
  export const savePerformancePlan = (data: PerformanceMarketingPlan) => {
    localStorage.setItem(KEYS.performancePlan, JSON.stringify(data));
  };
  
  // ============================================
  // LOAD FUNCTION — call on app start
  // ============================================
  
  export const loadPipelineState = (): PersistedPipelineState => {
    const safe = <T>(key: string): T | null => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
      } catch {
        return null;
      }
    };
  
    return {
      rawInput: localStorage.getItem(KEYS.rawInput),
      clientBrief: safe<ClientBrief>(KEYS.clientBrief),
      marketResearch: safe<MarketResearch>(KEYS.marketResearch),
      brandStrategy: safe<BrandStrategy>(KEYS.brandStrategy),
      websitePlan: safe<WebsiteSEOPlan>(KEYS.websitePlan),
      socialPlan: safe<SocialMediaPlan>(KEYS.socialPlan),
      performancePlan: safe<PerformanceMarketingPlan>(KEYS.performancePlan),
      lastRun: localStorage.getItem(KEYS.lastRun)
    };
  };
  
  // ============================================
  // CLEAR FUNCTION — start fresh
  // ============================================
  
  export const clearPipelineState = () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  };
  
  // ============================================
  // CHECK — which agents are already done
  // ============================================
  
  export const getCompletedAgents = (): {
    agent1: boolean;
    agent2: boolean;
    agent3: boolean;
    agent4: boolean;
    agent5: boolean;
    agent6: boolean;
  } => {
    const state = loadPipelineState();
    return {
      agent1: !!state.clientBrief,
      agent2: !!state.marketResearch,
      agent3: !!state.brandStrategy,
      agent4: !!state.websitePlan,
      agent5: !!state.socialPlan,
      agent6: !!state.performancePlan
    };
  };