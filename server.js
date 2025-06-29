const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./db");
const { runMigrations } = require("./migrate");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Run database migrations on startup
const initializeDatabase = async () => {
  try {
    console.log("🔄 Running database migrations...");
    await runMigrations();
    console.log("✅ Database migrations completed");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
};

// API endpoint to get landing page data by id
app.get("/api/landing", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }
  try {
    const [rows] = await db.query(
      "SELECT * FROM landing_pages WHERE landing_page_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Landing page not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST endpoint to create or update landing page data
app.post("/api/landing", async (req, res) => {
  const {
    landing_page_id,
    partner_logo_url,
    primary_header,
    subheader,
    loom_url,
    features_list,
    brand_color,
    workflow_chart,
    workflow_name,
    revenue_impact_summary,
    gtm_challenge_addressed,
    target_gtm_metrics_improved,
    in_depth_workflow_breakdown,
  } = req.body;
  if (!landing_page_id) {
    return res.status(400).json({ error: "Missing landing_page_id parameter" });
  }
  try {
    const [existing] = await db.query(
      "SELECT id FROM landing_pages WHERE landing_page_id = ?",
      [landing_page_id]
    );
    if (existing.length > 0) {
      // Update existing record
      await db.query(
        "UPDATE landing_pages SET partner_logo_url = ?, primary_header = ?, subheader = ?, loom_url = ?, features_list = ?, brand_color = ?, workflow_chart = ?, workflow_name = ?, revenue_impact_summary = ?, gtm_challenge_addressed = ?, target_gtm_metrics_improved = ?, in_depth_workflow_breakdown = ? WHERE landing_page_id = ?",
        [
          partner_logo_url,
          primary_header,
          subheader,
          loom_url,
          features_list,
          brand_color,
          workflow_chart,
          workflow_name,
          revenue_impact_summary,
          gtm_challenge_addressed,
          target_gtm_metrics_improved,
          in_depth_workflow_breakdown,
          landing_page_id,
        ]
      );
      res.status(200).json({
        message: "Landing page data updated successfully",
        landing_page_id,
        id: existing[0].id,
      });
    } else {
      // Insert new record
      const [result] = await db.query(
        "INSERT INTO landing_pages (landing_page_id, partner_logo_url, primary_header, subheader, loom_url, features_list, brand_color, workflow_chart, workflow_name, revenue_impact_summary, gtm_challenge_addressed, target_gtm_metrics_improved, in_depth_workflow_breakdown) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          landing_page_id,
          partner_logo_url,
          primary_header,
          subheader,
          loom_url,
          features_list,
          brand_color,
          workflow_chart,
          workflow_name,
          revenue_impact_summary,
          gtm_challenge_addressed,
          target_gtm_metrics_improved,
          in_depth_workflow_breakdown,
        ]
      );
      res.status(201).json({
        message: "Landing page data created successfully",
        landing_page_id,
        id: result.insertId,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Run migrations first
    await initializeDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
