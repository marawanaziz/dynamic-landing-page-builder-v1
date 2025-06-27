import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

// Main logo URL
const MAIN_LOGO_URL =
  "https://sixtysixten.com/wp-content/uploads/2023/04/logo.webp";

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
    // First try to parse as JSON
    return JSON.parse(featuresString);
  } catch (e) {
    // If not JSON, split by comma and trim whitespace
    return featuresString.split(",").map((feature) => feature.trim());
  }
}

function LandingPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Use the current origin for the API request
    const apiUrl = `${window.location.origin}/api/landing?id=${id}`;
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
          <div className="logo-container">
            <div className="logo">
              <img
                src={MAIN_LOGO_URL}
                alt="SixtySixten Logo"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
            {data.partner_logo_url && (
              <div className="logo">
                <img
                  src={data.partner_logo_url}
                  alt="Partner Logo"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <h1>{data.primary_header}</h1>
          <p>{data.subheader}</p>
          <a href="#calendly" className="cta-button" onClick={scrollToCalendly}>
            Schedule Your Strategy Call
          </a>
        </div>
      </section>

      {/* Video section */}
      {data.loom_url && (
        <section className="video-section">
          <div className="container">
            <div className="video-container">
              <div className="loom-embed">
                <iframe
                  src={getLoomEmbedUrl(data.loom_url)}
                  frameBorder="0"
                  webkitallowfullscreen="true"
                  mozallowfullscreen="true"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How We Help section */}
      <section className="help-section">
        <div className="container">
          <h2>How We Help You Succeed</h2>
          <div className="help-grid">
            {features.map((feature, idx) => {
              const icons = ["🚀", "📊", "🎯", "⚡", "💡", "🤝"];
              const icon = icons[idx % icons.length];
              return (
                <div className="help-card" key={idx}>
                  <div className="help-icon">{icon}</div>
                  <h3>{feature}</h3>
                  <p>
                    We help you achieve this through our proven methodologies
                    and strategic approach.
                  </p>
                </div>
              );
            })}
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing/:id" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
