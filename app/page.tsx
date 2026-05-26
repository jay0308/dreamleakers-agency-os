"use client";

import { useState } from "react";
import { runIntakeAgent } from "@/agents/intakeAgent";
import { runResearchAgent } from "@/agents/researchAgent";
import { runStrategyAgent } from "@/agents/strategyAgent";
import { ClientBrief, MarketResearch, BrandStrategy, MarketOpportunity } from "@/types";

// ============================================
// STAGE INDICATOR
// ============================================

type Stage = "idle" | "intake" | "research" | "strategy" | "complete";

const stages = [
  { id: "intake",   label: "01 Client Intake",    icon: "◈" },
  { id: "research", label: "02 Market Research",  icon: "◉" },
  { id: "strategy", label: "03 Brand Strategy",   icon: "◍" },
];

function StageIndicator({ current }: { current: Stage }) {
  const order = ["intake", "research", "strategy"];
  return (
    <div className="flex gap-6 mb-10 flex-wrap">
      {stages.map((s) => {
        const currentIdx = order.indexOf(current);
        const stageIdx = order.indexOf(s.id);
        const isDone = current === "complete" || currentIdx > stageIdx;
        const isActive = current === s.id;
        return (
          <div
            key={s.id}
            className={`flex items-center gap-2 text-xs tracking-widest
              uppercase font-mono transition-all duration-300
              ${isActive ? "text-orange-400" : isDone ? "text-green-400" : "text-gray-600"}`}
          >
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
// BRIEF CARD
// ============================================

function BriefCard({ label, value }: { label: string; value: string | string[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
        {label.replace(/([A-Z])/g, " $1").trim()}
      </p>
      <p className="text-sm text-white">
        {Array.isArray(value) ? value.join(", ") || "None" : value || "Not specified"}
      </p>
    </div>
  );
}

// ============================================
// RESEARCH CARD
// ============================================

function ResearchCard({ label, value }: {
  label: string;
  value: string | string[] | MarketOpportunity[]
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-xs text-orange-400 uppercase tracking-widest mb-2 font-mono">
        {label}
      </p>
      {typeof value === "string" && (
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{value}</p>
      )}
      {Array.isArray(value) && value.length > 0 && typeof value[0] === "string" && (
        <ul className="space-y-1">
          {(value as string[]).map((item, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <span className="text-orange-400 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && (
        <div className="space-y-3">
          {(value as MarketOpportunity[]).map((item, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-3 space-y-1">
              <p className="text-sm text-white font-semibold">{item.opportunity}</p>
              <p className="text-xs text-gray-400">{item.rationale}</p>
              <span className="text-xs text-orange-400 font-mono">{item.marketSize}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// STRATEGY CARD
// ============================================

function StrategyCard({ label, value }: { label: string; value: string | string[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-xs text-orange-400 uppercase tracking-widest mb-2 font-mono">
        {label}
      </p>
      {typeof value === "string" && (
        <p className="text-sm text-gray-300 leading-relaxed">{value}</p>
      )}
      {Array.isArray(value) && (
        <ul className="space-y-2">
          {value.map((item, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <span className="text-orange-400 font-bold mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({ status, title }: { status: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-10">
      <span className="text-green-400 text-lg">✅</span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <span className="text-xs font-mono text-green-400 
        border border-green-400 px-2 py-0.5 rounded">
        {status}
      </span>
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
  const [error, setError] = useState<string>("");

  const isRunning = stage !== "idle" && stage !== "complete";

  const runPipeline = async () => {
    if (!input.trim()) return;
    setError("");
    setClientBrief(null);
    setMarketResearch(null);
    setBrandStrategy(null);

    // ── AGENT 1 ──
    setStage("intake");
    const intakeResult = await runIntakeAgent(input);
    if (!intakeResult.success || !intakeResult.data) {
      setError(intakeResult.error || "Agent 1 failed");
      setStage("idle");
      return;
    }
    setClientBrief(intakeResult.data);

    // ── AGENT 2 ──
    setStage("research");
    const researchResult = await runResearchAgent(intakeResult.data);
    if (!researchResult.success || !researchResult.data) {
      setError(researchResult.error || "Agent 2 failed");
      setStage("idle");
      return;
    }
    setMarketResearch(researchResult.data);

    // ── AGENT 3 ──
    setStage("strategy");
    const strategyResult = await runStrategyAgent(researchResult.data);
    if (!strategyResult.success || !strategyResult.data) {
      setError(strategyResult.error || "Agent 3 failed");
      setStage("idle");
      return;
    }
    setBrandStrategy(strategyResult.data);
    setStage("complete");
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <p className="text-xs tracking-widest text-orange-400 uppercase mb-2 font-mono">
          Dreamleakers Agency OS
        </p>
        <h1 className="text-3xl font-bold mb-1">
          Marketing Intelligence Pipeline
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Paste client information. Three agents work in sequence.
        </p>

        {/* Stage Indicator */}
        <StageIndicator current={stage} />

        {/* Input */}
        <textarea
          rows={8}
          className="w-full bg-gray-900 border border-gray-700
            rounded-lg p-4 text-sm text-white resize-none
            focus:outline-none focus:border-orange-400"
          placeholder="Paste raw client info here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isRunning}
        />

        {/* Run Button */}
        <button
          onClick={runPipeline}
          disabled={!input.trim() || isRunning}
          className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-400
            disabled:bg-gray-700 disabled:text-gray-500
            text-black font-bold rounded-lg text-sm
            transition-all duration-200"
        >
          {stage === "intake"   && "⚙ Agent 1 Running..."}
          {stage === "research" && "⚙ Agent 2 Running..."}
          {stage === "strategy" && "⚙ Agent 3 Running..."}
          {stage === "idle"     && "Run Pipeline →"}
          {stage === "complete" && "Run Again →"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800
            rounded-lg text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Agent 1 Output */}
        {clientBrief && (
          <>
            <SectionHeader status="COMPLETE" title="Agent 1 — Structured Client Brief" />
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(clientBrief).map(([key, value]) => (
                <BriefCard key={key} label={key} value={value as string | string[]} />
              ))}
            </div>
          </>
        )}

        {/* Agent 2 Output */}
        {marketResearch && (
          <>
            <SectionHeader status="COMPLETE" title="Agent 2 — Market Research Report" />
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(marketResearch).map(([key, value]) => (
                <ResearchCard
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
                  value={value as string | string[] | MarketOpportunity[]}
                />
              ))}
            </div>
          </>
        )}

        {/* Agent 3 Output */}
        {brandStrategy && (
          <>
            <SectionHeader status="COMPLETE" title="Agent 3 — Brand Strategy" />
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(brandStrategy).map(([key, value]) => (
                <StrategyCard
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
                  value={value as string | string[]}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}