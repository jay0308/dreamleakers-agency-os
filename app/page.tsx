"use client";

import { useState, useEffect } from "react";
import Sidebar, { ActiveView } from "@/components/Sidebar";
import OverviewView from "@/components/views/OverviewView";
import AgentView from "@/components/views/AgentView";
import { runIntakeAgent } from "@/agents/intakeAgent";
import { runResearchAgent } from "@/agents/researchAgent";
import { runStrategyAgent } from "@/agents/strategyAgent";
import { runWebsiteAgent } from "@/agents/websiteAgent";
import { runSocialAgent } from "@/agents/socialAgent";
import { runPerformanceAgent } from "@/agents/performanceAgent";
import {
  ClientBrief, MarketResearch, BrandStrategy,
  WebsiteSEOPlan, SocialMediaPlan, PerformanceMarketingPlan
} from "@/types";
import {
  loadPipelineState,
  clearPipelineState,
  saveRawInput,
  saveClientBrief,
  saveMarketResearch,
  saveBrandStrategy,
  saveWebsitePlan,
  saveSocialPlan,
  savePerformancePlan
} from "@/utils/storage";

type Stage =
  "idle" | "intake" | "research" |
  "strategy" | "parallel" | "complete";

export default function Home() {

  // ── STATE ──
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [lastRun, setLastRun] = useState<string | null>(null);

  const [clientBrief, setClientBrief] =
    useState<ClientBrief | null>(null);
  const [marketResearch, setMarketResearch] =
    useState<MarketResearch | null>(null);
  const [brandStrategy, setBrandStrategy] =
    useState<BrandStrategy | null>(null);
  const [websitePlan, setWebsitePlan] =
    useState<WebsiteSEOPlan | null>(null);
  const [socialPlan, setSocialPlan] =
    useState<SocialMediaPlan | null>(null);
  const [performancePlan, setPerformancePlan] =
    useState<PerformanceMarketingPlan | null>(null);

  const [cachedAgents, setCachedAgents] = useState({
    agent1: false, agent2: false, agent3: false,
    agent4: false, agent5: false, agent6: false
  });

  const completedAgents = {
    agent1: !!clientBrief,
    agent2: !!marketResearch,
    agent3: !!brandStrategy,
    agent4: !!websitePlan,
    agent5: !!socialPlan,
    agent6: !!performancePlan
  };

  const isRunning = stage !== "idle" && stage !== "complete";

  // ── RESTORE FROM CACHE ──
  useEffect(() => {
    const saved = loadPipelineState();
    if (saved.rawInput) setInput(saved.rawInput);
    if (saved.lastRun) setLastRun(saved.lastRun);
    if (saved.clientBrief) setClientBrief(saved.clientBrief);
    if (saved.marketResearch) setMarketResearch(saved.marketResearch);
    if (saved.brandStrategy) setBrandStrategy(saved.brandStrategy);
    if (saved.websitePlan) setWebsitePlan(saved.websitePlan);
    if (saved.socialPlan) setSocialPlan(saved.socialPlan);
    if (saved.performancePlan) setPerformancePlan(saved.performancePlan);
    if (saved.performancePlan || saved.brandStrategy) {
      setStage("complete");
    }
    setCachedAgents({
      agent1: !!saved.clientBrief,
      agent2: !!saved.marketResearch,
      agent3: !!saved.brandStrategy,
      agent4: !!saved.websitePlan,
      agent5: !!saved.socialPlan,
      agent6: !!saved.performancePlan
    });
  }, []);

  // ── CLEAR ──
  const handleNewClient = () => {
    clearPipelineState();
    setInput(""); setStage("idle"); setError("");
    setLastRun(null);
    setClientBrief(null); setMarketResearch(null);
    setBrandStrategy(null); setWebsitePlan(null);
    setSocialPlan(null); setPerformancePlan(null);
    setCachedAgents({
      agent1: false, agent2: false, agent3: false,
      agent4: false, agent5: false, agent6: false
    });
    setActiveView("overview");
  };

  // ── PIPELINE ──
  const runPipeline = async () => {
    if (!input.trim()) return;
    setError("");
    saveRawInput(input);

    // Agent 1
    let brief = clientBrief;
    if (!brief) {
      setStage("intake");
      const r = await runIntakeAgent(input);
      if (!r.success || !r.data) {
        setError(r.error || "Agent 1 failed");
        setStage("idle"); return;
      }
      brief = r.data;
      setClientBrief(brief);
      saveClientBrief(brief);
      setLastRun(new Date().toISOString());
      setCachedAgents(p => ({ ...p, agent1: true }));
    }

    // Agent 2
    let research = marketResearch;
    if (!research) {
      setStage("research");
      const r = await runResearchAgent(brief);
      if (!r.success || !r.data) {
        setError(r.error || "Agent 2 failed");
        setStage("idle"); return;
      }
      research = r.data;
      setMarketResearch(research);
      saveMarketResearch(research);
      setCachedAgents(p => ({ ...p, agent2: true }));
    }

    // Agent 3
    let strategy = brandStrategy;
    if (!strategy) {
      setStage("strategy");
      const r = await runStrategyAgent(brief, research);
      if (!r.success || !r.data) {
        setError(r.error || "Agent 3 failed");
        setStage("idle"); return;
      }
      strategy = r.data;
      setBrandStrategy(strategy);
      saveBrandStrategy(strategy);
      setCachedAgents(p => ({ ...p, agent3: true }));
    }

    // Agents 4, 5, 6 — Parallel
    const needsWebsite = !websitePlan;
    const needsSocial = !socialPlan;
    const needsPerformance = !performancePlan;

    if (needsWebsite || needsSocial || needsPerformance) {
      setStage("parallel");
      const tasks = [];

      if (needsWebsite) {
        tasks.push(
          runWebsiteAgent(brief, strategy).then(r => {
            if (r.success && r.data) {
              setWebsitePlan(r.data);
              saveWebsitePlan(r.data);
              setCachedAgents(p => ({ ...p, agent4: true }));
            }
          })
        );
      }
      if (needsSocial) {
        tasks.push(
          runSocialAgent(brief, strategy).then(r => {
            if (r.success && r.data) {
              setSocialPlan(r.data);
              saveSocialPlan(r.data);
              setCachedAgents(p => ({ ...p, agent5: true }));
            }
          })
        );
      }
      if (needsPerformance) {
        tasks.push(
          runPerformanceAgent(brief, research, strategy).then(r => {
            if (r.success && r.data) {
              setPerformancePlan(r.data);
              savePerformancePlan(r.data);
              setCachedAgents(p => ({ ...p, agent6: true }));
            }
          })
        );
      }

      await Promise.all(tasks);
    }

    setStage("complete");
  };

  // ── RENDER ──
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg)"
    }}>

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        completedAgents={completedAgents}
        cachedAgents={cachedAgents}
        isRunning={isRunning}
        currentStage={stage}
        clientBrief={clientBrief}
        onNewClient={handleNewClient}
      />

      {/* Main Content */}
      <main style={{
        marginLeft: 240,
        flex: 1,
        padding: "40px 48px",
        maxWidth: "calc(100vw - 240px)",
        overflowY: "auto"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          {activeView === "overview" && (
            <OverviewView
              input={input}
              onInputChange={setInput}
              onRun={runPipeline}
              isRunning={isRunning}
              stage={stage}
              completedAgents={completedAgents}
              lastRun={lastRun}
              error={error}
            />
          )}

          {activeView !== "overview" && (
            <AgentView
              agentId={activeView}
              clientBrief={clientBrief}
              marketResearch={marketResearch}
              brandStrategy={brandStrategy}
              websitePlan={websitePlan}
              socialPlan={socialPlan}
              performancePlan={performancePlan}
              cachedAgents={cachedAgents}
            />
          )}

        </div>
      </main>

    </div>
  );
}