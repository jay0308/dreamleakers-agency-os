"use client";

interface OverviewViewProps {
  input: string;
  onInputChange: (val: string) => void;
  onRun: () => void;
  isRunning: boolean;
  stage: string;
  completedAgents: Record<string, boolean>;
  lastRun: string | null;
  error: string;
}

const agentMeta = [
  { key: "agent1", label: "Client Intake",      time: "~15s" },
  { key: "agent2", label: "Market Research",    time: "~30s" },
  { key: "agent3", label: "Brand Strategy",     time: "~25s" },
  { key: "agent4", label: "Website & SEO",      time: "~20s" },
  { key: "agent5", label: "Social Media",       time: "~20s" },
  { key: "agent6", label: "Performance Mktg",   time: "~20s" },
];

const stageLabels: Record<string, string> = {
  idle: "Ready to run",
  intake: "Agent 1 — Processing intake...",
  research: "Agent 2 — Researching market...",
  strategy: "Agent 3 — Building strategy...",
  parallel: "Agents 4, 5, 6 — Running in parallel...",
  complete: "Pipeline complete"
};

export default function OverviewView({
  input,
  onInputChange,
  onRun,
  isRunning,
  stage,
  completedAgents,
  lastRun,
  error
}: OverviewViewProps) {

  const completedCount = Object.values(completedAgents)
    .filter(Boolean).length;

  const formatted = lastRun
    ? new Date(lastRun).toLocaleDateString("en-IN", {
        day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit"
      })
    : null;

  return (
    <div style={{ animation: "slide-in 0.3s ease" }}>

      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--accent)",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 8
        }}>
          Dreamleakers Agency OS
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "var(--text)",
          marginBottom: 8,
          letterSpacing: "-0.5px"
        }}>
          Marketing Intelligence Pipeline
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          6 AI agents. Parallel execution. Checkpointed.
          Complete go-to-market strategy in minutes.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 28
      }}>
        {[
          { label: "Agents Complete", value: `${completedCount}/6` },
          { label: "Last Run", value: formatted || "Never" },
          { label: "Status", value: stageLabels[stage] || "Ready" }
        ].map((stat, i) => (
          <div key={i} style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "16px 18px"
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              color: "var(--muted)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 6
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: i === 0 && completedCount === 6
                ? "var(--green)" : "var(--text)"
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Visual */}
      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 28
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--muted)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 16
        }}>
          Pipeline Status
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
          rowGap: 12
        }}>
          {agentMeta.map((agent, i) => {
            const done = completedAgents[agent.key];
            const isParallel = ["agent4", "agent5", "agent6"]
              .includes(agent.key);
            const isActive = (stage === agent.key.replace("agent", "")
              || (stage === "parallel" && isParallel));

            return (
              <div key={agent.key} style={{
                display: "flex",
                alignItems: "center"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: done
                      ? "rgba(34,197,94,0.15)"
                      : isActive
                      ? "rgba(255,91,46,0.15)"
                      : "var(--surface)",
                    border: `1px solid ${done
                      ? "rgba(34,197,94,0.4)"
                      : isActive
                      ? "var(--accent)"
                      : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    boxShadow: isActive
                      ? "0 0 12px rgba(255,91,46,0.3)" : "none"
                  }}>
                    {done
                      ? <span style={{ color: "var(--green)", fontSize: 14 }}>✓</span>
                      : isActive
                      ? <span style={{
                          width: 8, height: 8,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          animation: "pulse-dot 1s infinite"
                        }} />
                      : <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          color: "var(--muted2)"
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                    }
                  </div>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8,
                    color: done
                      ? "var(--green)"
                      : isActive
                      ? "var(--accent)"
                      : "var(--muted2)",
                    whiteSpace: "nowrap"
                  }}>
                    {agent.time}
                  </span>
                </div>

                {/* Connector */}
                {i < agentMeta.length - 1 && (
                  <div style={{
                    width: i === 2 ? 16 : 20,
                    height: 1,
                    background: completedAgents[agent.key]
                      ? "var(--green)" : "var(--border)",
                    transition: "background 0.3s ease",
                    margin: "0 2px",
                    marginBottom: 20
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 16
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--muted)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12
        }}>
          Client Input
        </div>
        <textarea
          rows={6}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          disabled={isRunning}
          placeholder="Paste raw client information here — any language, any format. The agents will handle the rest."
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "14px 16px",
            color: "var(--text)",
            fontSize: 13,
            lineHeight: 1.6,
            resize: "none",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.15s ease"
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Run Button */}
      <button
        onClick={onRun}
        disabled={!input.trim() || isRunning}
        style={{
          padding: "14px 32px",
          background: !input.trim() || isRunning
            ? "var(--surface2)" : "var(--accent)",
          border: `1px solid ${!input.trim() || isRunning
            ? "var(--border)" : "var(--accent)"}`,
          borderRadius: 10,
          color: !input.trim() || isRunning
            ? "var(--muted)" : "#000",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          cursor: !input.trim() || isRunning
            ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          letterSpacing: 0.3
        }}
      >
        {isRunning
          ? `⚙ ${stageLabels[stage]}`
          : completedCount > 0
          ? "Continue Pipeline →"
          : "Run Full Pipeline →"}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 8,
          color: "#F87171",
          fontSize: 13
        }}>
          ❌ {error}
        </div>
      )}

    </div>
  );
}