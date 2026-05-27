"use client";

import { useState, useEffect } from "react";
import { runIntakeAgent } from "@/agents/intakeAgent";
import { runResearchAgent } from "@/agents/researchAgent";
import { runStrategyAgent } from "@/agents/strategyAgent";
import { runWebsiteAgent } from "@/agents/websiteAgent";
import { runSocialAgent } from "@/agents/socialAgent";
import { runPerformanceAgent } from "@/agents/performanceAgent";
import {
  ClientBrief, MarketResearch, BrandStrategy,
  WebsiteSEOPlan, SocialMediaPlan, PerformanceMarketingPlan,
  MarketOpportunity, PageBrief, ContentPost, AdCampaign
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

type Stage = "idle" | "intake" | "research" | "strategy" | "parallel" | "complete";

// ============================================
// STAGE INDICATOR
// ============================================

const stages = [
  { id: "intake",   label: "01 Intake",    icon: "◈" },
  { id: "research", label: "02 Research",  icon: "◉" },
  { id: "strategy", label: "03 Strategy",  icon: "◍" },
  { id: "parallel", label: "04 Execution", icon: "◎" },
];

function StageIndicator({ current }: { current: Stage }) {
  const order = ["intake", "research", "strategy", "parallel"];
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {stages.map((s) => {
        const currentIdx = order.indexOf(current);
        const stageIdx = order.indexOf(s.id);
        const isDone = current === "complete" || currentIdx > stageIdx;
        const isActive = current === s.id;
        return (
          <div key={s.id} className={`flex items-center gap-2 text-xs
            tracking-widest uppercase font-mono transition-all duration-300
            ${isActive ? "text-orange-400" :
              isDone ? "text-green-400" : "text-gray-600"}`}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
            {isDone && <span>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// CHECKPOINT BADGE
// ============================================

function CheckpointBadge({ lastRun }: { lastRun: string | null }) {
  if (!lastRun) return null;
  const date = new Date(lastRun);
  const formatted = date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  });
  return (
    <div className="flex items-center gap-2 bg-green-950 border
      border-green-800 rounded-lg px-4 py-3 mb-6">
      <span className="text-green-400 text-sm">💾</span>
      <div>
        <p className="text-xs text-green-400 font-mono">
          CHECKPOINT RESTORED
        </p>
        <p className="text-xs text-gray-400">
          Last run: {formatted} — Completed agents loaded from cache.
          Only missing agents will run.
        </p>
      </div>
    </div>
  );
}

// ============================================
// AGENT STATUS BADGE
// ============================================

function AgentBadge({
  label,
  cached
}: {
  label: string;
  cached: boolean
}) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-10">
      <span className={cached ? "text-blue-400 text-lg" : "text-green-400 text-lg"}>
        {cached ? "💾" : "✅"}
      </span>
      <h2 className="text-lg font-semibold">{label}</h2>
      <span className={`text-xs font-mono px-2 py-0.5 rounded border
        ${cached
          ? "text-blue-400 border-blue-400"
          : "text-green-400 border-green-400"}`}>
        {cached ? "FROM CACHE" : "COMPLETE"}
      </span>
    </div>
  );
}

// ============================================
// CARD COMPONENTS
// ============================================

function Card({ label, children }: {
  label: string;
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-xs text-orange-400 uppercase
        tracking-widest mb-2 font-mono">
        {label}
      </p>
      {children}
    </div>
  );
}

function StringValue({ value }: { value: string }) {
  return (
    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
      {value}
    </p>
  );
}

function ListValue({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {(items ?? []).map((item, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span className="text-orange-400 mt-0.5">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// OUTPUT RENDERERS
// ============================================

function BriefOutput({ data }: { data: ClientBrief }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key} label={key.replace(/([A-Z])/g, " $1").trim()}>
          <p className="text-sm text-white">
            {Array.isArray(value)
              ? value.join(", ") || "None"
              : value || "Not specified"}
          </p>
        </Card>
      ))}
    </div>
  );
}

function ResearchOutput({ data }: { data: MarketResearch }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key}
          label={key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}>
          {typeof value === "string" && <StringValue value={value} />}
          {Array.isArray(value) && value.length > 0
            && typeof value[0] === "string" && (
            <ListValue items={value as string[]} />
          )}
          {Array.isArray(value) && value.length > 0
            && typeof value[0] === "object" && (
            <div className="space-y-3">
              {(value as MarketOpportunity[]).map((item, i) => (
                <div key={i} className="border border-gray-700
                  rounded-lg p-3">
                  <p className="text-sm text-white font-semibold">
                    {item.opportunity}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.rationale}
                  </p>
                  <span className="text-xs text-orange-400 font-mono">
                    {item.marketSize}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function StrategyOutput({ data }: { data: BrandStrategy }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key}
          label={key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}>
          {typeof value === "string"
            ? <StringValue value={value} />
            : <ListValue items={value as string[]} />}
        </Card>
      ))}
    </div>
  );
}

function WebsiteOutput({ data }: { data: WebsiteSEOPlan }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card label="SITEMAP">
        <ListValue items={data.sitemap} />
      </Card>
      <Card label="PAGE BRIEFS">
        <div className="space-y-4">
          {(data.pageBriefs ?? []).map((page: PageBrief, i: number) => (
            <div key={i} className="border border-gray-700
              rounded-lg p-3 space-y-2">
              <p className="text-sm text-white font-bold">
                {page.pageName}
              </p>
              <p className="text-xs text-gray-400">
                Purpose: {page.purpose}
              </p>
              <p className="text-xs text-orange-400">
                SEO: {page.targetKeyword}
              </p>
              <p className="text-xs text-blue-400">
                GEO: {page.geoKeyword}
              </p>
              <p className="text-xs text-gray-300">
                {page.contentBrief}
              </p>
            </div>
          ))}
        </div>
      </Card>
      <Card label="TECHNICAL SEO">
        <ListValue items={data.technicalSEO} />
      </Card>
      <Card label="LOCAL SEO ACTIONS">
        <ListValue items={data.localSEOActions} />
      </Card>
      <Card label="GEO OPTIMIZATION">
        <ListValue items={data.geoOptimizationTips} />
      </Card>
      <Card label="BLOG TOPICS">
        <ListValue items={data.blogTopics} />
      </Card>
    </div>
  );
}

function SocialOutput({ data }: { data: SocialMediaPlan }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card label="PLATFORM STRATEGY">
        <StringValue value={data.platformStrategy} />
      </Card>
      <Card label="CONTENT PILLARS">
        <ListValue items={data.contentPillars} />
      </Card>
      <Card label="WEEKLY SCHEDULE">
        <ListValue items={data.weeklySchedule} />
      </Card>
      <Card label="SAMPLE POSTS">
        <div className="space-y-4">
          {(data.samplePosts ?? []).map((post: ContentPost, i: number) => (
            <div key={i} className="border border-gray-700
              rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <span className="text-xs text-orange-400 font-mono
                  border border-orange-400 px-2 py-0.5 rounded">
                  {post.platform}
                </span>
                <span className="text-xs text-blue-400 font-mono
                  border border-blue-400 px-2 py-0.5 rounded">
                  {post.format}
                </span>
              </div>
              <p className="text-xs text-gray-500">{post.topic}</p>
              <p className="text-sm text-gray-300">{post.caption}</p>
              <p className="text-xs text-gray-500">
                {(post.hashtags ?? []).join(" ")}
              </p>
            </div>
          ))}
        </div>
      </Card>
      <Card label="HASHTAG STRATEGY">
        <div className="flex flex-wrap gap-2">
          {(data.hashtagStrategy ?? []).map((tag, i) => (
            <span key={i} className="text-xs text-orange-400
              bg-orange-400/10 border border-orange-400/30
              px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </Card>
      <Card label="GROWTH TACTICS">
        <ListValue items={data.growthTactics} />
      </Card>
    </div>
  );
}

function PerformanceOutput({ data }: { data: PerformanceMarketingPlan }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card label="CHANNEL STRATEGY">
        <StringValue value={data.channelStrategy} />
      </Card>
      <Card label="AD CAMPAIGNS">
        <div className="space-y-4">
          {(data.campaigns ?? []).map((c: AdCampaign, i: number) => (
            <div key={i} className="border border-gray-700
              rounded-lg p-3 space-y-2">
              <p className="text-sm text-white font-bold">
                {c.campaignName}
              </p>
              <div className="flex gap-2">
                <span className="text-xs text-orange-400 font-mono
                  border border-orange-400 px-2 py-0.5 rounded">
                  {c.platform}
                </span>
                <span className="text-xs text-green-400 font-mono
                  border border-green-400 px-2 py-0.5 rounded">
                  {c.budget}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Objective: {c.objective}
              </p>
              <p className="text-xs text-gray-400">
                Audience: {c.targetAudience}
              </p>
              <p className="text-sm text-gray-300 italic">
                "{c.adCopy}"
              </p>
            </div>
          ))}
        </div>
      </Card>
      <Card label="AUDIENCE SEGMENTS">
        <ListValue items={data.audienceSegments} />
      </Card>
      <Card label="BUDGET ALLOCATION">
        <ListValue items={data.budgetAllocation} />
      </Card>
      <Card label="KPIS">
        <ListValue items={data.kpis} />
      </Card>
      <Card label="30 DAY PLAN">
        <ListValue items={data.thirtyDayPlan} />
      </Card>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [marketResearch, setMarketResearch] = useState<MarketResearch | null>(null);
  const [brandStrategy, setBrandStrategy] = useState<BrandStrategy | null>(null);
  const [websitePlan, setWebsitePlan] = useState<WebsiteSEOPlan | null>(null);
  const [socialPlan, setSocialPlan] = useState<SocialMediaPlan | null>(null);
  const [performancePlan, setPerformancePlan] =
    useState<PerformanceMarketingPlan | null>(null);
  const [error, setError] = useState<string>("");
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [cachedAgents, setCachedAgents] = useState({
    agent1: false, agent2: false, agent3: false,
    agent4: false, agent5: false, agent6: false
  });

  const isRunning = stage !== "idle" && stage !== "complete";

  // ── RESTORE FROM LOCALSTORAGE ON LOAD ──
  useEffect(() => {
    const saved = loadPipelineState();
    if (saved.rawInput) setInput(saved.rawInput);
    if (saved.lastRun) setLastRun(saved.lastRun);

    const cached = {
      agent1: !!saved.clientBrief,
      agent2: !!saved.marketResearch,
      agent3: !!saved.brandStrategy,
      agent4: !!saved.websitePlan,
      agent5: !!saved.socialPlan,
      agent6: !!saved.performancePlan
    };
    setCachedAgents(cached);

    // Restore state from cache
    if (saved.clientBrief) setClientBrief(saved.clientBrief);
    if (saved.marketResearch) setMarketResearch(saved.marketResearch);
    if (saved.brandStrategy) setBrandStrategy(saved.brandStrategy);
    if (saved.websitePlan) setWebsitePlan(saved.websitePlan);
    if (saved.socialPlan) setSocialPlan(saved.socialPlan);
    if (saved.performancePlan) setPerformancePlan(saved.performancePlan);

    // If all agents done restore complete stage
    if (saved.performancePlan) setStage("complete");
    else if (saved.brandStrategy) setStage("complete");

  }, []);

  // ── CLEAR AND START FRESH ──
  const handleClear = () => {
    clearPipelineState();
    setInput("");
    setClientBrief(null);
    setMarketResearch(null);
    setBrandStrategy(null);
    setWebsitePlan(null);
    setSocialPlan(null);
    setPerformancePlan(null);
    setStage("idle");
    setLastRun(null);
    setCachedAgents({
      agent1: false, agent2: false, agent3: false,
      agent4: false, agent5: false, agent6: false
    });
  };

  // ── RUN PIPELINE WITH CHECKPOINTING ──
  const runPipeline = async () => {
    if (!input.trim()) return;
    setError("");
    saveRawInput(input);

    // ── AGENT 1 — use cache or run ──
    let brief = clientBrief;
    if (!brief) {
      setStage("intake");
      const result = await runIntakeAgent(input);
      if (!result.success || !result.data) {
        setError(result.error || "Agent 1 failed");
        setStage("idle"); return;
      }
      brief = result.data;
      setClientBrief(brief);
      saveClientBrief(brief);
      setCachedAgents(p => ({ ...p, agent1: true }));
      setLastRun(new Date().toISOString());
    }

    // ── AGENT 2 — use cache or run ──
    let research = marketResearch;
    if (!research) {
      setStage("research");
      const result = await runResearchAgent(brief);
      if (!result.success || !result.data) {
        setError(result.error || "Agent 2 failed");
        setStage("idle"); return;
      }
      research = result.data;
      setMarketResearch(research);
      saveMarketResearch(research);
      setCachedAgents(p => ({ ...p, agent2: true }));
    }

    // ── AGENT 3 — use cache or run ──
    let strategy = brandStrategy;
    if (!strategy) {
      setStage("strategy");
      const result = await runStrategyAgent(brief, research);
      if (!result.success || !result.data) {
        setError(result.error || "Agent 3 failed");
        setStage("idle"); return;
      }
      strategy = result.data;
      setBrandStrategy(strategy);
      saveBrandStrategy(strategy);
      setCachedAgents(p => ({ ...p, agent3: true }));
    }

    // ── AGENTS 4, 5, 6 — parallel with checkpointing ──
    const needsWebsite = !websitePlan;
    const needsSocial = !socialPlan;
    const needsPerformance = !performancePlan;

    if (needsWebsite || needsSocial || needsPerformance) {
      setStage("parallel");

      const parallelTasks = [];

      if (needsWebsite) {
        parallelTasks.push(
          runWebsiteAgent(brief, strategy).then(r => {
            if (r.success && r.data) {
              setWebsitePlan(r.data);
              saveWebsitePlan(r.data);
              setCachedAgents(p => ({ ...p, agent4: true }));
            }
            return r;
          })
        );
      }

      if (needsSocial) {
        parallelTasks.push(
          runSocialAgent(brief, strategy).then(r => {
            if (r.success && r.data) {
              setSocialPlan(r.data);
              saveSocialPlan(r.data);
              setCachedAgents(p => ({ ...p, agent5: true }));
            }
            return r;
          })
        );
      }

      if (needsPerformance) {
        parallelTasks.push(
          runPerformanceAgent(brief, research, strategy).then(r => {
            if (r.success && r.data) {
              setPerformancePlan(r.data);
              savePerformancePlan(r.data);
              setCachedAgents(p => ({ ...p, agent6: true }));
            }
            return r;
          })
        );
      }

      await Promise.all(parallelTasks);
    }

    setStage("complete");
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <p className="text-xs tracking-widest text-orange-400
          uppercase mb-2 font-mono">
          Dreamleakers Agency OS
        </p>
        <h1 className="text-3xl font-bold mb-1">
          Marketing Intelligence Pipeline
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          6 AI agents. Checkpointed. Complete marketing strategy.
        </p>

        {/* Checkpoint Badge */}
        {lastRun && <CheckpointBadge lastRun={lastRun} />}

        {/* Stage Indicator */}
        <StageIndicator current={stage} />

        {/* Input */}
        <textarea
          rows={6}
          className="w-full bg-gray-900 border border-gray-700
            rounded-lg p-4 text-sm text-white resize-none
            focus:outline-none focus:border-orange-400"
          placeholder="Paste raw client info here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isRunning}
        />

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={runPipeline}
            disabled={!input.trim() || isRunning}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-400
              disabled:bg-gray-700 disabled:text-gray-500
              text-black font-bold rounded-lg text-sm transition-all"
          >
            {stage === "intake"   && "⚙ Agent 1 Running..."}
            {stage === "research" && "⚙ Agent 2 Running..."}
            {stage === "strategy" && "⚙ Agent 3 Running..."}
            {stage === "parallel" && "⚙ Agents 4+5+6 Parallel..."}
            {stage === "idle"     && "Run Pipeline →"}
            {stage === "complete" && "Continue Pipeline →"}
          </button>

          {(lastRun || clientBrief) && (
            <button
              onClick={handleClear}
              disabled={isRunning}
              className="px-4 py-3 bg-transparent border border-gray-700
                hover:border-red-500 hover:text-red-400
                text-gray-400 rounded-lg text-sm transition-all"
            >
              🗑 Start Fresh
            </button>
          )}
        </div>

        {/* Cached Agents Summary */}
        {lastRun && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(cachedAgents).map(([agent, done]) => (
              <span key={agent} className={`text-xs font-mono px-2 py-1
                rounded border ${done
                  ? "text-blue-400 border-blue-400 bg-blue-400/10"
                  : "text-gray-600 border-gray-700"}`}>
                {agent.replace("agent", "A")} {done ? "💾" : "○"}
              </span>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800
            rounded-lg text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Outputs */}
        {clientBrief && (
          <>
            <AgentBadge
              label="Agent 1 — Client Brief"
              cached={cachedAgents.agent1 && stage === "complete"}
            />
            <BriefOutput data={clientBrief} />
          </>
        )}
        {marketResearch && (
          <>
            <AgentBadge
              label="Agent 2 — Market Research"
              cached={cachedAgents.agent2 && stage === "complete"}
            />
            <ResearchOutput data={marketResearch} />
          </>
        )}
        {brandStrategy && (
          <>
            <AgentBadge
              label="Agent 3 — Brand Strategy"
              cached={cachedAgents.agent3 && stage === "complete"}
            />
            <StrategyOutput data={brandStrategy} />
          </>
        )}
        {websitePlan && (
          <>
            <AgentBadge
              label="Agent 4 — Website & SEO"
              cached={cachedAgents.agent4 && stage === "complete"}
            />
            <WebsiteOutput data={websitePlan} />
          </>
        )}
        {socialPlan && (
          <>
            <AgentBadge
              label="Agent 5 — Social Media"
              cached={cachedAgents.agent5 && stage === "complete"}
            />
            <SocialOutput data={socialPlan} />
          </>
        )}
        {performancePlan && (
          <>
            <AgentBadge
              label="Agent 6 — Performance Marketing"
              cached={cachedAgents.agent6 && stage === "complete"}
            />
            <PerformanceOutput data={performancePlan} />
          </>
        )}

      </div>
    </main>
  );
}