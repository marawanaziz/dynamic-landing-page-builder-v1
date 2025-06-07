CREATE TABLE landing_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  landing_page_id VARCHAR(36) UNIQUE,
  partner_logo_url VARCHAR(255),
  primary_header VARCHAR(255),
  subheader TEXT,
  loom_url VARCHAR(255),
  features_list TEXT, -- JSON array of strings
  brand_color VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 