import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

// Replace with your static logo asset
import logo from "./logo.svg";

function getLoomEmbedUrl(url) {
  if (!url) return "";
  // Loom share URLs are like https://www.loom.com/share/VIDEO_ID
  // Embed format: https://www.loom.com/embed/VIDEO_ID
  const match = url.match(/loom.com\/(?:share|embed)\/([\w-]+)/);
  return match ? `https://www.loom.com/embed/${match[1]}` : "";
}

function LandingPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Parse features list (stored as JSON array)
  let features = [];
  try {
    features = JSON.parse(data.features_list || "[]");
  } catch (e) {
    features = [];
  }

  // Use brand color from API, fallback to default
  const brandColor = data.brand_color || "#0057ff";

  return (
    <div className="landing-page" style={{ "--brand-color": brandColor }}>
      {/* Dual Logo Header */}
      <header className="dual-logo-header">
        <img src={logo} alt="Your Company Logo" className="main-logo" />
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

      {/* Loom Video Embed */}
      {data.loom_url && (
        <div className="loom-video">
          <iframe
            src={getLoomEmbedUrl(data.loom_url)}
            title="Loom Video"
            frameBorder="0"
            allowFullScreen
            style={{ width: "100%", height: "360px", maxWidth: 640 }}
          ></iframe>
        </div>
      )}

      {/* Features Section Header */}
      <h3 className="features-header">Key Features</h3>

      {/* Features List */}
      <ul className="features-list">
        {features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>

      {/* Call-to-Action Header */}
      <div className="cta-header">Ready to get started?</div>

      {/* Calendly Embed (replace with your actual Calendly link) */}
      <div className="calendly-embed">
        <iframe
          src="https://calendly.com/your-calendly-link"
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
