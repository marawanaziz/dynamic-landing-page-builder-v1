import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import VideoCard from "./VideoCard";

// Logo URLs
const MAIN_LOGO_URL =
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo.webp";
const MAIN_LOGO_WHITE_URL =
  "https://sixtysixten.com/wp-content/uploads/2025/06/SSTLOGO-White-scaled.png";

// Trusted by company logos
const TRUSTED_LOGOS = [
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo-trused1.webp",
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo-trused2.webp",
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo-trused3.webp",
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo-trused4.webp",
];

function getLoomEmbedUrl(url) {
  if (!url) return "";
  // If it's already an embed URL, return as is
  if (url.includes("/embed/")) return url;
  // If it's a share URL, convert to embed URL
  const match = url.match(/loom.com\/share\/([\w-]+)/);
  return match ? `https://www.loom.com/embed/${match[1]}` : url;
}

function parseFeatures(featuresString) {
  if (!featuresString) return [];
  try {
    // Try to parse as JSON first
    return JSON.parse(featuresString);
  } catch {
    // If not JSON, split by comma
    return featuresString.split(",").map((f) => f.trim());
  }
}

function parseWorkflowBreakdown(
  breakdownText,
  onlyPhases = false,
  onlySpecialCards = false
) {
  if (!breakdownText) return "";

  // Convert all **Label:** to <strong>Label:</strong>
  breakdownText = breakdownText.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Add a newline after each bold label if not already present
  breakdownText = breakdownText.replace(/(<strong>.*?:<\/strong>)/g, "$1\n");

  // Split into sections by phase or header
  const phaseRegex = /### (.*?)\n([\s\S]*?)(?=### |$)/g;
  let html = "";
  let match;
  let specialCards = [];
  while ((match = phaseRegex.exec(breakdownText)) !== null) {
    const title = match[1].trim();
    let content = match[2].trim();
    if (
      /Integration Architecture/i.test(title) ||
      /Success Measurement/i.test(title) ||
      /ROI Projection/i.test(title)
    ) {
      let lines = content
        .split(/\n|<br\s*\/?>(?![^<]*<\/li>)/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("<ul>"));
      let list =
        "<ul>" +
        lines
          .map((l) =>
            l.startsWith("<li>") ? l : `<li>${l.replace(/^[-•→]?\s*/, "")}</li>`
          )
          .join("") +
        "</ul>";
      let cardClass = /Integration Architecture/i.test(title)
        ? "integration-list"
        : /Success Measurement/i.test(title)
        ? "success-measurement-card"
        : "roi-projection-card";
      specialCards.push(
        `<div class=\"${cardClass}\"><h4>${title}</h4>${list}</div>`
      );
    } else if (!onlySpecialCards) {
      let lines = content
        .split(/\n+/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      let details = lines
        .map((line) => {
          // If line starts with <strong>...</strong>, split into label and value
          const match = line.match(/^<strong>(.+?:)<\/strong>\s*(.*)$/);
          if (match) {
            return `<div class='phase-detail'><span class='phase-label'>${match[1]}</span> <span class='phase-value'>${match[2]}</span></div>`;
          } else {
            return `<div class='phase-detail phase-freeform'>${line}</div>`;
          }
        })
        .join("");
      if (!onlySpecialCards) {
        html += `<div class=\"phase-section\"><div class=\"phase-title\">${title}</div>${details}</div>`;
      }
    }
  }
  if (onlySpecialCards) {
    return specialCards.join("");
  }
  if (!onlyPhases && specialCards.length > 0) {
    html += `<div class='workflow-cards-row'>${specialCards.join("")}</div>`;
  }
  return html;
}

function useDarkLogoFlag() {
  // Checks if the URL contains ?dark or &dark, even if a trailing period is present
  let search = window.location.search;
  if (search.endsWith(".")) search = search.slice(0, -1);
  return /[?&]dark(=|&|$)/.test(search) || /[?&]darkmode(=|&|$)/.test(search);
}

function LandingPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkLogo = useDarkLogoFlag();

  const scrollToCalendly = (e) => {
    e.preventDefault();
    const calendlySection = document.getElementById("calendly");
    if (calendlySection) {
      calendlySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Missing landing page ID in URL.");
      setLoading(false);
      return;
    }
    // Clean the id for the API call only
    const cleanId = id.replace(/\.$/, "");
    const apiUrl = `${window.location.origin}/api/landing?id=${cleanId}`;
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Landing page not found");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Add interactive effects after component mounts
  useEffect(() => {
    if (!data) return;

    // Add hover effects to cards
    const cards = document.querySelectorAll(".help-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });

    // Add parallax effect to hero section
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero");
      const rate = scrolled * -0.5;

      if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Add loading animation
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, [data]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  // Parse features list (handles both JSON array and comma-separated string)
  const features = parseFeatures(data.features_list);

  // Use brand color from API, fallback to default
  const brandColor = data.brand_color || "#ff6b6b";

  return (
    <div className="landing-page" style={{ "--brand-color": brandColor }}>
      {/* Header with logos */}
      <header className="header">
        <div className="container">
          <div className="navbar">
            <div className="logo-container">
              <div className={`logo${darkLogo ? " dark" : ""}`}>
                <img
                  src={darkLogo ? MAIN_LOGO_WHITE_URL : MAIN_LOGO_URL}
                  alt="SixtySixten Logo"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              {data.partner_logo_url && (
                <div className={`logo${darkLogo ? " dark" : ""}`}>
                  <img
                    src={data.partner_logo_url}
                    alt="Partner Logo"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </div>
              )}
            </div>
            <div className="navbar-cta">
              <a
                href="#calendly"
                className="cta-button navbar-button"
                onClick={scrollToCalendly}
              >
                Schedule Your Strategy Call
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <h1>{data.primary_header}</h1>
          <p>{data.subheader}</p>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="trusted-by-section">
        <div className="container">
          <p className="trusted-by-text">
            Trusted by more than 100+ industry leaders company worldwide
          </p>
          <div className="trusted-logos">
            {TRUSTED_LOGOS.map((logo, index) => (
              <div key={index} className="trusted-logo">
                <img src={logo} alt={`Trusted Company ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonial section */}
      <section className="testimonial-section">
        <div className="container">
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: 60,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Client Testimonial
          </h2>
          <VideoCard />
        </div>
      </section>

      {/* How We Help section */}
      <section className="help-section">
        <div className="container">
          <h2>
            Revolutionize Your Go-to-Market
            <br />
            Strategy
          </h2>
          <div className="help-grid">
            {/* Card 1: Enhanced Revenue Pipeline */}
            <div className="help-card card-yellow">
              <div className="help-icon icon-yellow">💰</div>
              <h3>Enhanced Revenue Pipeline</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Identify{" "}
                    <span className="highlight-yellow">
                      high-value prospects
                    </span>{" "}
                    with data-backed methods
                  </span>
                </li>
                <li>
                  <span>
                    Achieve higher conversions through{" "}
                    <span className="highlight-yellow">strategic timing</span>
                  </span>
                </li>
                <li>
                  <span>
                    Unlock hidden market opportunities across{" "}
                    <span className="highlight-yellow">territories</span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 2: Streamlined Operations */}
            <div className="help-card card-blue">
              <div className="help-icon icon-blue">⚡</div>
              <h3>Streamlined Operations</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Eliminate lost deals with{" "}
                    <span className="highlight-blue">automated tracking</span>
                  </span>
                </li>
                <li>
                  <span>
                    Orchestrate{" "}
                    <span className="highlight-blue">
                      multi-channel campaigns
                    </span>{" "}
                    seamlessly
                  </span>
                </li>
                <li>
                  <span>
                    Free sales teams from{" "}
                    <span className="highlight-blue">administrative tasks</span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 3: Accelerated Scale */}
            <div className="help-card card-red">
              <div className="help-icon icon-red">🚀</div>
              <h3>
                Accelerated
                <br />
                Scale
              </h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Maintain <span className="highlight-red">data quality</span>{" "}
                    while expanding rapidly
                  </span>
                </li>
                <li>
                  <span>
                    Deploy automation{" "}
                    <span className="highlight-red">
                      without technical complexity
                    </span>
                  </span>
                </li>
                <li>
                  <span>
                    Grow revenue{" "}
                    <span className="highlight-red">
                      without scaling headcount
                    </span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 4: Strategic Intelligence */}
            <div className="help-card card-green">
              <div className="help-icon icon-green">📊</div>
              <h3>Strategic Intelligence</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Convert activities into{" "}
                    <span className="highlight-green">measurable ROI</span>
                  </span>
                </li>
                <li>
                  <span>
                    Monitor your revenue engine in{" "}
                    <span className="highlight-green">real-time</span>
                  </span>
                </li>
                <li>
                  <span>
                    Optimize targeting with{" "}
                    <span className="highlight-green">behavioral insights</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly section */}
      <section className="calendly-section" id="calendly">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>
            Book your free strategy session and discover how we can help
            transform your business.
          </p>
          <div className="calendly-container">
            <iframe
              src="https://calendly.com/sixtysixten/30min"
              title="Book a Demo"
              frameBorder="0"
              style={{
                width: "100%",
                height: "700px",
                border: "none",
                borderRadius: "15px",
              }}
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

// Utility function to capitalize the first alphabetical character
function capitalizeFirstAlpha(str) {
  if (!str) return str;
  return str.replace(/([a-zA-Z])/, (m) => m.toUpperCase());
}

// Utility function to strip trailing period from URLs
function cleanUrl(url) {
  return url ? url.replace(/(https?:\/\/[\w\.-\/]+)\./g, "$1") : url;
}

// Global clipboard patch to clean URLs with trailing periods
if (typeof window !== "undefined") {
  document.addEventListener("copy", function (e) {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString();
    // Replace URLs ending with a period
    const cleaned = text.replace(/(https?:\/\/[\w\.-\/]+)\./g, "$1");
    if (cleaned !== text) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", cleaned);
    }
  });
}

function WorkflowPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkLogo = useDarkLogoFlag();

  const scrollToCalendly = (e) => {
    e.preventDefault();
    const calendlySection = document.getElementById("calendly");
    if (calendlySection) {
      calendlySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Missing workflow page ID in URL.");
      setLoading(false);
      return;
    }
    // Clean the id for the API call only
    const cleanId = id.replace(/\.$/, "");
    const apiUrl = `${window.location.origin}/api/landing?id=${cleanId}`;
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Workflow page not found");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Add interactive effects after component mounts
  useEffect(() => {
    if (!data) return;

    // Add hover effects to cards
    const cards = document.querySelectorAll(".help-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });

    // Add parallax effect to hero section
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero");
      const rate = scrolled * -0.5;

      if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Add loading animation
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, [data]);

  // Initialize Mermaid when component mounts and data is loaded
  useEffect(() => {
    if (data && data.workflow_chart) {
      // Load Mermaid script dynamically
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
      script.onload = () => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: true });
          // Force re-render of the flowchart
          setTimeout(() => {
            window.mermaid.init();
          }, 100);
        }
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup script if component unmounts
        const existingScript = document.querySelector('script[src*="mermaid"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [data]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  // Parse features list (handles both JSON array and comma-separated string)
  const features = parseFeatures(data.features_list);

  // Use brand color from API, fallback to default
  const brandColor = data.brand_color || "#ff6b6b";

  return (
    <div className="landing-page" style={{ "--brand-color": brandColor }}>
      {/* Header with logos */}
      <header className="header">
        <div className="container">
          <div className="navbar">
            <div className="logo-container">
              <div className={`logo${darkLogo ? " dark" : ""}`}>
                <img
                  src={darkLogo ? MAIN_LOGO_WHITE_URL : MAIN_LOGO_URL}
                  alt="SixtySixten Logo"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              {data.partner_logo_url && (
                <div className={`logo${darkLogo ? " dark" : ""}`}>
                  <img
                    src={data.partner_logo_url}
                    alt="Partner Logo"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </div>
              )}
            </div>
            <div className="navbar-cta">
              <a
                href="#calendly"
                className="cta-button navbar-button"
                onClick={scrollToCalendly}
              >
                Schedule Your Strategy Call
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <h1>{data.primary_header}</h1>
          <p>{data.subheader}</p>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="trusted-by-section">
        <div className="container">
          <p className="trusted-by-text">
            Trusted by more than 100+ industry leaders company worldwide
          </p>
          <div className="trusted-logos">
            {TRUSTED_LOGOS.map((logo, index) => (
              <div key={index} className="trusted-logo">
                <img src={logo} alt={`Trusted Company ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow section - replaces video section */}
      {data.workflow_name && (
        <section className="workflow-section">
          <div className="container">
            <div className="workflow-container">
              <div className="workflow-header">
                <h1 className="workflow-title">GTM Automation Workflow</h1>
                <p className="workflow-subtitle">{data.workflow_name}</p>
              </div>
              <div className="workflow-content">
                <div className="top-section">
                  <div className="details-section">
                    <div className="section-block">
                      <h3 className="section-title">Revenue Impact Summary</h3>
                      <div className="section-content">
                        <div className="revenue-impact-grid">
                          {Array.isArray(data.revenue_impact_summary)
                            ? data.revenue_impact_summary.map((item, idx) => {
                                const clean = item.replace(
                                  /^Direct impact:\s*/i,
                                  ""
                                );
                                return (
                                  <div
                                    key={idx}
                                    className="revenue-impact-card"
                                  >
                                    {capitalizeFirstAlpha(clean)}
                                  </div>
                                );
                              })
                            : typeof data.revenue_impact_summary === "string" &&
                              data.revenue_impact_summary
                                // Only split on newlines, semicolons, or commas, NOT periods
                                .split(/\n|;|,/)
                                .filter((line) => line.trim())
                                .map((item, idx) => {
                                  const clean = item.replace(
                                    /^Direct impact:\s*/i,
                                    ""
                                  );
                                  return (
                                    <div
                                      key={idx}
                                      className="revenue-impact-card"
                                    >
                                      {capitalizeFirstAlpha(clean)}
                                    </div>
                                  );
                                })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <div className="section-block">
                      <h3 className="section-title">GTM Challenge Addressed</h3>
                      <div className="section-content">
                        <div className="gtm-challenge-highlight">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.gtm_challenge_addressed?.replace(
                                /\n/g,
                                "<br/>"
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <div className="section-block">
                      <h3 className="section-title">
                        Target GTM Metrics Improved
                      </h3>
                      <div className="section-content">
                        <div className="metrics-grid">
                          {Array.isArray(data.target_gtm_metrics_improved)
                            ? data.target_gtm_metrics_improved.map(
                                (metric, index) => (
                                  <div key={index} className="metric-card">
                                    <div className="metric-value">{metric}</div>
                                  </div>
                                )
                              )
                            : typeof data.target_gtm_metrics_improved ===
                                "string" &&
                              data.target_gtm_metrics_improved
                                .split("\n")
                                .filter((line) => line.trim())
                                .map((metric, index) => (
                                  <div key={index} className="metric-card">
                                    <div className="metric-value">{metric}</div>
                                  </div>
                                ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bottom-section">
                  <div className="workflow-detail-section">
                    <div className="section-block">
                      <h3 className="section-title">
                        In Depth Workflow Breakdown
                      </h3>
                      <div className="section-content">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: parseWorkflowBreakdown(
                              data.in_depth_workflow_breakdown,
                              true
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="diagram-section">
                    <div className="mermaid-container">
                      <div className="mermaid">{data.workflow_chart}</div>
                    </div>
                  </div>
                </div>

                {/* Render the workflow cards row below the entire workflow section */}
                {data.in_depth_workflow_breakdown && (
                  <div
                    className="workflow-cards-row"
                    dangerouslySetInnerHTML={{
                      __html: parseWorkflowBreakdown(
                        data.in_depth_workflow_breakdown,
                        false,
                        true
                      ),
                    }}
                  />
                )}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <a
                href="#calendly"
                className="cta-button"
                onClick={scrollToCalendly}
              >
                Schedule Your Strategy Call
              </a>
            </div>
          </div>
        </section>
      )}

      {/* How We Help section */}
      <section className="help-section">
        <div className="container">
          <h2>
            Revolutionize Your Go-to-Market
            <br />
            Strategy
          </h2>
          <div className="help-grid">
            {/* Card 1: Enhanced Revenue Pipeline */}
            <div className="help-card card-yellow">
              <div className="help-icon icon-yellow">💰</div>
              <h3>Enhanced Revenue Pipeline</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Identify{" "}
                    <span className="highlight-yellow">
                      high-value prospects
                    </span>{" "}
                    with data-backed methods
                  </span>
                </li>
                <li>
                  <span>
                    Achieve higher conversions through{" "}
                    <span className="highlight-yellow">strategic timing</span>
                  </span>
                </li>
                <li>
                  <span>
                    Unlock hidden market opportunities across{" "}
                    <span className="highlight-yellow">territories</span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 2: Streamlined Operations */}
            <div className="help-card card-blue">
              <div className="help-icon icon-blue">⚡</div>
              <h3>Streamlined Operations</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Eliminate lost deals with{" "}
                    <span className="highlight-blue">automated tracking</span>
                  </span>
                </li>
                <li>
                  <span>
                    Orchestrate{" "}
                    <span className="highlight-blue">
                      multi-channel campaigns
                    </span>{" "}
                    seamlessly
                  </span>
                </li>
                <li>
                  <span>
                    Free sales teams from{" "}
                    <span className="highlight-blue">administrative tasks</span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 3: Accelerated Scale */}
            <div className="help-card card-red">
              <div className="help-icon icon-red">🚀</div>
              <h3>
                Accelerated
                <br />
                Scale
              </h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Maintain <span className="highlight-red">data quality</span>{" "}
                    while expanding rapidly
                  </span>
                </li>
                <li>
                  <span>
                    Deploy automation{" "}
                    <span className="highlight-red">
                      without technical complexity
                    </span>
                  </span>
                </li>
                <li>
                  <span>
                    Grow revenue{" "}
                    <span className="highlight-red">
                      without scaling headcount
                    </span>
                  </span>
                </li>
              </ul>
            </div>
            {/* Card 4: Strategic Intelligence */}
            <div className="help-card card-green">
              <div className="help-icon icon-green">📊</div>
              <h3>Strategic Intelligence</h3>
              <ul className="feature-list">
                <li>
                  <span>
                    Convert activities into{" "}
                    <span className="highlight-green">measurable ROI</span>
                  </span>
                </li>
                <li>
                  <span>
                    Monitor your revenue engine in{" "}
                    <span className="highlight-green">real-time</span>
                  </span>
                </li>
                <li>
                  <span>
                    Optimize targeting with{" "}
                    <span className="highlight-green">behavioral insights</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly section */}
      <section className="calendly-section" id="calendly">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>
            Book your free strategy session and discover how we can help
            transform your business.
          </p>
          <div className="calendly-container">
            <iframe
              src="https://calendly.com/sixtysixten/30min"
              title="Book a Demo"
              frameBorder="0"
              style={{
                width: "100%",
                height: "700px",
                border: "none",
                borderRadius: "15px",
              }}
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrailingDotRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.match(/\.$/)) {
      navigate(location.pathname.replace(/\.$/, ""), { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <TrailingDotRedirect />
      <Routes>
        <Route path="/landing/:id" element={<LandingPage />} />
        <Route path="/workflow/:id" element={<WorkflowPage />} />
      </Routes>
    </Router>
  );
}

export default App;
