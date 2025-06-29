CREATE TABLE landing_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  landing_page_id VARCHAR(64) UNIQUE,
  partner_logo_url VARCHAR(255),
  primary_header VARCHAR(255),
  subheader TEXT,
  loom_url VARCHAR(255),
  features_list TEXT, -- JSON array of strings
  brand_color VARCHAR(32),
  workflow_chart TEXT, -- Mermaid flowchart data
  workflow_name VARCHAR(255),
  revenue_impact_summary TEXT,
  gtm_challenge_addressed TEXT,
  target_gtm_metrics_improved TEXT,
  in_depth_workflow_breakdown TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 