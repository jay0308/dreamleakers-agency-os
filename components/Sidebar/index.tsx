"use client";

import { ClientBrief } from "@/types";

// ============================================
// TYPES
// ============================================

export type ActiveView =
  | "overview"
  | "agent1" | "agent2" | "agent3"
  | "agent4" | "agent5" | "agent6" | "agent7";

interface AgentItem {
  id: ActiveView;
  label: string;
  sublabel: string;
  icon: string;
}

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  completedAgents: Record<string, boolean>;
  cachedAgents: Record<string, boolean>;
  isRunning: boolean;
  currentStage: string;
  clientBrief: ClientBrief | null;
  onNewClient: () => void;
}

// ============================================
// AGENT NAV ITEMS
// ============================================

const agentItems: AgentItem[] = [
  {
    id: "agent1",
    label: "Client Intake",
    sublabel: "Structured Brief",
    icon: "01"
  },
  {
    id: "agent2",
    label: "Market Research",
    sublabel: "SEO + GEO Analysis",
    icon: "02"
  },
  {
    id: "agent3",
    label: "Brand Strategy",
    sublabel: "Voice + Positioning",
    icon: "03"
  },
  {
    id: "agent4",
    label: "Website & SEO",
    sublabel: "Pages + Keywords",
    icon: "04"
  },
  {
    id: "agent5",
    label: "Social Media",
    sublabel: "Content + Calendar",
    icon: "05"
  },
  {
    id: "agent6",
    label: "Performance Mktg",
    sublabel: "Ads + Campaigns",
    icon: "06"
  },
  {
    id: "agent7",
    label: "Delivery & Handoff",
    sublabel: "Brief + Spec + Report",
    icon: "07"
  },
];

// ============================================
// AGENT STATUS
// ============================================

const agentKey: Record<string, string> = {
  agent1: "agent1", agent2: "agent2", agent3: "agent3",
  agent4: "agent4", agent5: "agent5", agent6: "agent6", agent7: "agent7"
};

const stageToAgent: Record<string, string> = {
  intake: "agent1",
  research: "agent2",
  strategy: "agent3",
  parallel: "agent456"
};

// ============================================
// SIDEBAR
// ============================================

export default function Sidebar({
  activeView,
  onNavigate,
  completedAgents,
  cachedAgents,
  isRunning,
  currentStage,
  clientBrief,
  onNewClient
}: SidebarProps) {

  const getAgentStatus = (agentId: string) => {
    const key = agentKey[agentId];
    if (completedAgents[key]) return "done";
    if (currentStage === "parallel" &&
      ["agent4", "agent5", "agent6"].includes(agentId)) return "active";
    if (stageToAgent[currentStage] === agentId) return "active";
    return "idle";
  };

  return (
    <aside style={{
      width: 340,
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 50,
    }}>

      {/* Logo */}
      <div style={{
        padding: "24px 20px 20px",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 16,
          fontWeight: 800,
          color: "var(--accent)",
          letterSpacing: "-0.5px",
          marginBottom: 2
        }}>
          DREAMLEAKERS
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--muted)",
          letterSpacing: 2,
          textTransform: "uppercase"
        }}>
          Agency OS v1.0
        </div>
      </div>

      {/* Client Badge */}
      {clientBrief && (
        <div style={{
          margin: "12px 12px 0",
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          borderRadius: 8,
          padding: "10px 12px"
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "var(--muted)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 4
          }}>
            Active Client
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 2
          }}>
            {clientBrief.businessName}
          </div>
          <div style={{
            fontSize: 11,
            color: "var(--muted)",
          }}>
            {clientBrief.industry}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>

        {/* Overview */}
        <button
          onClick={() => onNavigate("overview")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            background: activeView === "overview"
              ? "rgba(255,91,46,0.08)" : "transparent",
            border: "none",
            borderLeft: activeView === "overview"
              ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease",
            marginBottom: 8
          }}
        >
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: activeView === "overview"
              ? "var(--accent)" : "var(--muted)",
          }}>⊞</span>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: activeView === "overview"
              ? "var(--text)" : "var(--muted)",
          }}>
            Overview
          </span>
        </button>

        {/* Divider */}
        <div style={{
          padding: "4px 20px 8px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--muted2)",
          letterSpacing: 2,
          textTransform: "uppercase"
        }}>
          Pipeline
        </div>

        {/* Agent Items */}
        {agentItems.map((item, idx) => {
          const status = getAgentStatus(item.id);
          const isActive = activeView === item.id;
          const isDone = status === "done";
          const isRunningNow = status === "active";

          return (
            <div key={item.id} style={{ position: "relative" }}>

              {/* Connector line */}
              {idx < agentItems.length - 1 && (
                <div style={{
                  position: "absolute",
                  left: 28,
                  top: "100%",
                  width: 1,
                  height: 8,
                  background: isDone
                    ? "var(--green)" : "var(--border)",
                  zIndex: 1,
                  transition: "background 0.3s ease"
                }} />
              )}

              <button
                onClick={() => isDone && onNavigate(item.id)}
                disabled={!isDone && !isRunningNow}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 20px",
                  background: isActive
                    ? "rgba(255,91,46,0.08)"
                    : isRunningNow
                    ? "rgba(255,91,46,0.04)"
                    : "transparent",
                  border: "none",
                  borderLeft: isActive
                    ? "2px solid var(--accent)"
                    : isRunningNow
                    ? "2px solid rgba(255,91,46,0.4)"
                    : "2px solid transparent",
                  cursor: isDone ? "pointer" : "default",
                  transition: "all 0.15s ease",
                  opacity: !isDone && !isRunningNow ? 0.4 : 1,
                  marginBottom: 4
                }}
              >
                {/* Icon / Status */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: isDone
                    ? "rgba(34,197,94,0.15)"
                    : isRunningNow
                    ? "rgba(255,91,46,0.15)"
                    : "var(--surface2)",
                  border: `1px solid ${isDone
                    ? "rgba(34,197,94,0.3)"
                    : isRunningNow
                    ? "rgba(255,91,46,0.3)"
                    : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s ease"
                }}>
                  {isDone ? (
                    <span style={{ fontSize: 10, color: "var(--green)" }}>✓</span>
                  ) : isRunningNow ? (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      animation: "pulse-dot 1s infinite"
                    }} />
                  ) : (
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8,
                      color: "var(--muted2)"
                    }}>
                      {item.icon}
                    </span>
                  )}
                </div>

                {/* Labels */}
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: isActive
                      ? "var(--text)"
                      : isDone
                      ? "var(--text)"
                      : "var(--muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: "var(--muted2)",
                    marginTop: 1
                  }}>
                    {item.sublabel}
                  </div>
                </div>

                {/* Cache badge */}
                {isDone && cachedAgents[agentKey[item.id]] && (
                  <span style={{
                    fontSize: 9,
                    color: "var(--blue)",
                    flexShrink: 0
                  }}>💾</span>
                )}

              </button>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 12px",
        borderTop: "1px solid var(--border)"
      }}>
        <button
          onClick={onNewClient}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "transparent",
            border: "1px solid var(--border2)",
            borderRadius: 8,
            color: "var(--muted)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "'DM Sans', sans-serif"
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
            (e.target as HTMLButtonElement).style.color = "var(--accent)";
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--border2)";
            (e.target as HTMLButtonElement).style.color = "var(--muted)";
          }}
        >
          <span>+</span>
          <span>New Client</span>
        </button>
      </div>

    </aside>
  );
}