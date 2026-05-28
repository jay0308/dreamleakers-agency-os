"use client";

import {
  ClientBrief, MarketResearch, BrandStrategy,
  WebsiteSEOPlan, SocialMediaPlan, PerformanceMarketingPlan,
  MarketOpportunity, PageBrief, ContentPost, AdCampaign
} from "@/types";

// ============================================
// BASE CARD
// ============================================

function Card({ label, accent = false, children }: {
  label: string;
  accent?: boolean;
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderTop: accent ? "1px solid rgba(255,91,46,0.3)" : "1px solid var(--border)",  // ← add this
      borderRadius: 10,
      padding: "18px 20px",
      marginBottom: 12,
      animation: "slide-in 0.3s ease"
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        color: accent ? "var(--accent)" : "var(--muted)",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 10
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function BodyText({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: 13,
      color: "#CCCCCC",
      lineHeight: 1.75,
      whiteSpace: "pre-line"
    }}>
      {text}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {(items ?? []).map((item, i) => (
        <li key={i} style={{
          display: "flex",
          gap: 10,
          marginBottom: 8,
          fontSize: 13,
          color: "#CCCCCC",
          lineHeight: 1.6
        }}>
          <span style={{
            color: "var(--accent)",
            flexShrink: 0,
            marginTop: 2,
            fontSize: 10
          }}>▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// AGENT VIEW HEADER
// ============================================

function AgentViewHeader({
  number,
  title,
  subtitle,
  cached
}: {
  number: string;
  title: string;
  subtitle: string;
  cached: boolean;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 8
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--accent)",
          letterSpacing: 2
        }}>
          AGENT {number}
        </div>
        {cached && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "var(--blue)",
            border: "1px solid rgba(56,189,248,0.3)",
            padding: "2px 8px",
            borderRadius: 4,
            letterSpacing: 1
          }}>
            💾 FROM CACHE
          </span>
        )}
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--green)",
          border: "1px solid rgba(34,197,94,0.3)",
          padding: "2px 8px",
          borderRadius: 4,
          letterSpacing: 1
        }}>
          ✓ COMPLETE
        </span>
      </div>
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 24,
        fontWeight: 800,
        color: "var(--text)",
        letterSpacing: "-0.5px",
        marginBottom: 6
      }}>
        {title}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>
        {subtitle}
      </p>
    </div>
  );
}

// ============================================
// INDIVIDUAL AGENT RENDERERS
// ============================================

function Agent1View({
  data,
  cached
}: {
  data: ClientBrief;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="01"
        title="Client Intake"
        subtitle="Raw input normalized into a structured brief"
        cached={cached}
      />
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        {Object.entries(data).map(([key, value]) => (
          <Card
            key={key}
            label={key.replace(/([A-Z])/g, " $1").trim()}
          >
            <p style={{ fontSize: 13, color: "var(--text)" }}>
              {Array.isArray(value)
                ? value.join(", ") || "None"
                : value || "Not specified"}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}

function Agent2View({
  data,
  cached
}: {
  data: MarketResearch;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="02"
        title="Market Research"
        subtitle="Deep market analysis with SEO + GEO keyword strategy"
        cached={cached}
      />
      {data.targetAudienceAnalysis && (
        <Card label="Target Audience Analysis" accent>
          <BodyText text={data.targetAudienceAnalysis} />
        </Card>
      )}
      {data.competitorLandscape && (
        <Card label="Competitor Landscape" accent>
          <BodyText text={data.competitorLandscape} />
        </Card>
      )}
      {data.marketOpportunities?.length > 0 && (
        <Card label="Market Opportunities" accent>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data.marketOpportunities as MarketOpportunity[]).map((o, i) => (
              <div key={i} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px"
              }}>
                <p style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 4
                }}>
                  {typeof o === "string" ? o : o.opportunity}
                </p>
                {typeof o !== "string" && (
                  <>
                    <p style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginBottom: 4
                    }}>
                      {o.rationale}
                    </p>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "var(--accent)"
                    }}>
                      {o.marketSize}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      {data.keyThreats?.length > 0 && (
        <Card label="Key Threats" accent>
          <BulletList items={data.keyThreats} />
        </Card>
      )}
      {data.positioningRecommendations && (
        <Card label="Positioning Recommendations" accent>
          <BodyText text={data.positioningRecommendations} />
        </Card>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        {data.seoKeywords?.length > 0 && (
          <Card label="SEO Keywords" accent>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.seoKeywords.map((kw, i) => (
                <span key={i} style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  background: "rgba(255,91,46,0.08)",
                  border: "1px solid rgba(255,91,46,0.2)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </Card>
        )}
        {data.geoKeywords?.length > 0 && (
          <Card label="GEO Keywords" accent>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.geoKeywords.map((kw, i) => (
                <span key={i} style={{
                  fontSize: 11,
                  color: "var(--blue)",
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
      {data.geoOpportunities?.length > 0 && (
        <Card label="GEO Opportunities" accent>
          <BulletList items={data.geoOpportunities} />
        </Card>
      )}
    </>
  );
}

function Agent3View({
  data,
  cached
}: {
  data: BrandStrategy;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="03"
        title="Brand Strategy"
        subtitle="Voice, positioning, messaging and taglines"
        cached={cached}
      />
      <div style={{
        background: "rgba(255,91,46,0.06)",
        border: "1px solid rgba(255,91,46,0.2)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 16
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "var(--accent)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 8
        }}>
          Unique Value Proposition
        </div>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.5
        }}>
          "{data.uniqueValueProposition}"
        </p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 0
      }}>
        <Card label="Brand Voice" accent>
          <BodyText text={data.brandVoice} />
        </Card>
        <Card label="Content Tone" accent>
          <BodyText text={data.contentTone} />
        </Card>
      </div>
      <Card label="Brand Personality" accent>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        }}>
          {(data.brandPersonality ?? []).map((trait, i) => (
            <span key={i} style={{
              fontSize: 12,
              color: "var(--text)",
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              padding: "6px 12px",
              borderRadius: 6,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {trait}
            </span>
          ))}
        </div>
      </Card>
      <Card label="Messaging Pillars" accent>
        <BulletList items={data.messagingPillars} />
      </Card>
      <Card label="Taglines" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
          {(data.taglines ?? []).map((tag, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--accent)"
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)"
              }}>
                {tag}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card label="Target Key Messages" accent>
        <BulletList items={data.targetKeyMessages} />
      </Card>
    </>
  );
}

function Agent4View({
  data,
  cached
}: {
  data: WebsiteSEOPlan;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="04"
        title="Website & SEO Plan"
        subtitle="Sitemap, page briefs, technical SEO, and content strategy"
        cached={cached}
      />
      <Card label="Sitemap" accent>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        }}>
          {(data.sitemap ?? []).map((page, i) => (
            <span key={i} style={{
              fontSize: 11,
              color: "var(--text)",
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              padding: "5px 10px",
              borderRadius: 5,
              fontFamily: "'DM Mono', monospace"
            }}>
              {page}
            </span>
          ))}
        </div>
      </Card>
      <Card label="Page Briefs" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          {(data.pageBriefs ?? []).map((page: PageBrief, i: number) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "14px 16px"
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8
              }}>
                {page.pageName}
              </p>
              <p style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 6
              }}>
                {page.purpose}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  background: "rgba(255,91,46,0.08)",
                  border: "1px solid rgba(255,91,46,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  SEO: {page.targetKeyword}
                </span>
                <span style={{
                  fontSize: 11,
                  color: "var(--blue)",
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  GEO: {page.geoKeyword}
                </span>
              </div>
              <p style={{
                fontSize: 12,
                color: "#AAAAAA",
                marginTop: 8
              }}>
                {page.contentBrief}
              </p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        <Card label="Technical SEO" accent>
          <BulletList items={data.technicalSEO} />
        </Card>
        <Card label="Local SEO Actions" accent>
          <BulletList items={data.localSEOActions} />
        </Card>
      </div>
      <Card label="GEO Optimization Tips" accent>
        <BulletList items={data.geoOptimizationTips} />
      </Card>
      <Card label="Blog Topics" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          {(data.blogTopics ?? []).map((topic, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--muted)"
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 13, color: "var(--text)" }}>
                {topic}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Agent5View({
  data,
  cached
}: {
  data: SocialMediaPlan;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="05"
        title="Social Media Plan"
        subtitle="Platform strategy, content calendar, and sample posts"
        cached={cached}
      />
      <Card label="Platform Strategy" accent>
        <BodyText text={data.platformStrategy} />
      </Card>
      <Card label="Content Pillars" accent>
        <BulletList items={data.contentPillars} />
      </Card>
      <Card label="Weekly Schedule" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          {(data.weeklySchedule ?? []).map((day, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 12,
              padding: "8px 12px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 13,
              color: "var(--text)"
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--accent)",
                minWidth: 20
              }}>
                D{i + 1}
              </span>
              {day}
            </div>
          ))}
        </div>
      </Card>
      <Card label="Sample Posts" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          {(data.samplePosts ?? []).map((post: ContentPost, i: number) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "14px 16px"
            }}>
              <div style={{
                display: "flex",
                gap: 8,
                marginBottom: 8
              }}>
                <span style={{
                  fontSize: 10,
                  color: "var(--accent)",
                  background: "rgba(255,91,46,0.08)",
                  border: "1px solid rgba(255,91,46,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {post.platform}
                </span>
                <span style={{
                  fontSize: 10,
                  color: "var(--blue)",
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {post.format}
                </span>
              </div>
              <p style={{
                fontSize: 11,
                color: "var(--muted)",
                marginBottom: 6
              }}>
                {post.topic}
              </p>
              <p style={{
                fontSize: 13,
                color: "var(--text)",
                lineHeight: 1.6,
                marginBottom: 8
              }}>
                {post.caption}
              </p>
              <p style={{
                fontSize: 11,
                color: "var(--muted)",
                fontFamily: "'DM Mono', monospace"
              }}>
                {(post.hashtags ?? []).join(" ")}
              </p>
            </div>
          ))}
        </div>
      </Card>
      <Card label="Hashtags" accent>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(data.hashtagStrategy ?? []).map((tag, i) => (
            <span key={i} style={{
              fontSize: 11,
              color: "var(--accent)",
              background: "rgba(255,91,46,0.08)",
              border: "1px solid rgba(255,91,46,0.2)",
              padding: "3px 10px",
              borderRadius: 20,
              fontFamily: "'DM Mono', monospace"
            }}>
              {tag}
            </span>
          ))}
        </div>
      </Card>
      <Card label="Growth Tactics" accent>
        <BulletList items={data.growthTactics} />
      </Card>
    </>
  );
}

function Agent6View({
  data,
  cached
}: {
  data: PerformanceMarketingPlan;
  cached: boolean
}) {
  return (
    <>
      <AgentViewHeader
        number="06"
        title="Performance Marketing"
        subtitle="Ad campaigns, audience segments, and 30-day plan"
        cached={cached}
      />
      <Card label="Channel Strategy" accent>
        <BodyText text={data.channelStrategy} />
      </Card>
      <Card label="Ad Campaigns" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          {(data.campaigns ?? []).map((c: AdCampaign, i: number) => (
            <div key={i} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "14px 16px"
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8
              }}>
                {c.campaignName}
              </p>
              <div style={{
                display: "flex",
                gap: 8,
                marginBottom: 8
              }}>
                <span style={{
                  fontSize: 10,
                  color: "var(--accent)",
                  background: "rgba(255,91,46,0.08)",
                  border: "1px solid rgba(255,91,46,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {c.platform}
                </span>
                <span style={{
                  fontSize: 10,
                  color: "var(--green)",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  {c.budget}
                </span>
              </div>
              <p style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 4
              }}>
                Objective: {c.objective}
              </p>
              <p style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 8
              }}>
                Audience: {c.targetAudience}
              </p>
              <p style={{
                fontSize: 13,
                color: "#CCCCCC",
                fontStyle: "italic",
                borderLeft: "2px solid var(--accent)",
                paddingLeft: 12
              }}>
                "{c.adCopy}"
              </p>
            </div>
          ))}
        </div>
      </Card>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        <Card label="Audience Segments" accent>
          <BulletList items={data.audienceSegments} />
        </Card>
        <Card label="Budget Allocation" accent>
          <BulletList items={data.budgetAllocation} />
        </Card>
      </div>
      <Card label="KPIs" accent>
        <BulletList items={data.kpis} />
      </Card>
      <Card label="30 Day Plan" accent>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
          {(data.thirtyDayPlan ?? []).map((week, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 14,
              padding: "10px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--accent)",
                minWidth: 40,
                marginTop: 2
              }}>
                WK {i + 1}
              </span>
              <span style={{
                fontSize: 13,
                color: "var(--text)",
                lineHeight: 1.6
              }}>
                {week}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ============================================
// MAIN EXPORT — routes to correct agent view
// ============================================

interface AgentViewProps {
  agentId: string;
  clientBrief: ClientBrief | null;
  marketResearch: MarketResearch | null;
  brandStrategy: BrandStrategy | null;
  websitePlan: WebsiteSEOPlan | null;
  socialPlan: SocialMediaPlan | null;
  performancePlan: PerformanceMarketingPlan | null;
  cachedAgents: Record<string, boolean>;
}

export default function AgentView({
  agentId,
  clientBrief,
  marketResearch,
  brandStrategy,
  websitePlan,
  socialPlan,
  performancePlan,
  cachedAgents
}: AgentViewProps) {

  if (agentId === "agent1" && clientBrief) {
    return <Agent1View data={clientBrief} cached={cachedAgents.agent1} />;
  }
  if (agentId === "agent2" && marketResearch) {
    return <Agent2View data={marketResearch} cached={cachedAgents.agent2} />;
  }
  if (agentId === "agent3" && brandStrategy) {
    return <Agent3View data={brandStrategy} cached={cachedAgents.agent3} />;
  }
  if (agentId === "agent4" && websitePlan) {
    return <Agent4View data={websitePlan} cached={cachedAgents.agent4} />;
  }
  if (agentId === "agent5" && socialPlan) {
    return <Agent5View data={socialPlan} cached={cachedAgents.agent5} />;
  }
  if (agentId === "agent6" && performancePlan) {
    return <Agent6View data={performancePlan} cached={cachedAgents.agent6} />;
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
      color: "var(--muted)",
      textAlign: "center"
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 32,
        marginBottom: 16,
        opacity: 0.3
      }}>
        ○
      </div>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        This agent hasn't run yet
      </p>
      <p style={{
        fontSize: 12,
        color: "var(--muted2)"
      }}>
        Run the pipeline from Overview to generate output
      </p>
    </div>
  );
}