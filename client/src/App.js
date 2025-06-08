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
  // Loom share URLs are like https://www.loom.com/share/VIDEO_ID
  // Embed format: https://www.loom.com/embed/VIDEO_ID
  const match = url.match(/loom.com\/(?:share|embed)\/([\w-]+)/);
  return match ? `https://www.loom.com/embed/${match[1]}` : "";
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

  const scrollToCalendly = () => {
    const calendlySection = document.getElementById("calendly-section");
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: "smooth" });
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

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  // Parse features list (handles both JSON array and comma-separated string)
  const features = parseFeatures(data.features_list);

  // Use brand color from API, fallback to default
  const brandColor = data.brand_color || "#0057ff";

  return (
    <div className="landing-page" style={{ "--brand-color": brandColor }}>
      {/* Dual Logo Header */}
      <header className="dual-logo-header">
        <img src={MAIN_LOGO_URL} alt="SixtySixten Logo" className="main-logo" />
        {data.partner_logo_url && (
          <img
            src={data.partner_logo_url}
            alt="Partner Logo"
            className="partner-logo"
          />
        )}
      </header>

      {/* Primary Header */}
      <h1 className="primary-header">{data.primary_header}</h1>

      {/* Subheader */}
      <h2 className="subheader">{data.subheader}</h2>

      {/* Centered CTA Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="cta-button"
          onClick={scrollToCalendly}
          style={{
            backgroundColor: brandColor,
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            fontSize: "18px",
            cursor: "pointer",
            margin: "20px 0",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          Schedule a Call
        </button>
      </div>

      {/* Loom Video Embed */}
      {data.loom_url && (
        <div
          style={{
            position: "relative",
            paddingBottom: "55.73033707865168%",
            height: 0,
          }}
        >
          <iframe
            src={data.loom_url}
            frameBorder="0"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            title="Loom Video"
          ></iframe>
        </div>
      )}

      {/* Features Section Header */}
      <h3 className="features-header">Key Features</h3>

      {/* Features List as Cards */}
      <div className="features-card-list">
        {features.map((feature, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{idx + 1}</div>
            <div className="feature-text">{feature}</div>
          </div>
        ))}
      </div>

      {/* Call-to-Action Header */}
      <div className="cta-header">Ready to get started?</div>

      {/* Calendly Embed */}
      <div id="calendly-section" className="calendly-embed">
        <iframe
          src="https://calendly.com/sixtysixten/30min"
          title="Book a Demo"
          frameBorder="0"
          style={{ width: "100%", minHeight: 600, maxWidth: 640 }}
        ></iframe>
      </div>
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
