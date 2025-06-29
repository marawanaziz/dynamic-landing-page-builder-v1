# Dynamic Landing Page Project

## Overview

This project builds a customizable landing page that dynamically loads content based on a unique identifier passed as a URL parameter. The page fetches personalized content from a MySQL database while maintaining a consistent structure and branding.

## Features

- **Dynamic Content:** Loads personalized content based on a unique ID.
- **Two Page Types:**
  - `/landing/:id` - Standard landing page with Loom video
  - `/workflow/:id` - Workflow page with Mermaid flowchart
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **API Integration:** Provides endpoints to create, update, and fetch landing page data.
- **Docker Support:** Containerized setup for easy deployment.

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- MySQL (if running locally)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=3000
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=landing_pages
```

If running locally, set `DB_HOST=localhost`.

### 3. Install Dependencies

```bash
npm install
cd client
npm install
```

### 4. Database Setup

Import the MySQL schema:

```bash
mysql -u root -p < landing_pages.sql
```

**Note**: The application now includes an automatic migration system. When you start the server, it will automatically run any pending database migrations to ensure your database schema is up to date.

### 5. Run with Docker

```bash
docker-compose up --build
```

This will start the backend, frontend, and MySQL database. The database migrations will run automatically on startup.

### 6. Run Locally

- **Backend:**
  ```bash
  npm start
  ```
- **Frontend:**
  ```bash
  cd client
  npm start
  ```
- **Full setup (with migrations):**
  ```bash
  npm run setup
  ```

## Database Migrations

The application includes an automatic migration system that ensures your database schema is always up to date.

### Automatic Migrations

- Migrations run automatically when the server starts
- No manual intervention required
- Safe to run multiple times

### Manual Migration Commands

```bash
# Run migrations manually
npm run migrate

# Check migration status
npm run migrate:status

# Setup database and start server
npm run setup
```

### Migration Files

Migration files are stored in the `migrations/` directory. See `migrations/README.md` for detailed documentation.

## Usage

### Access the Pages

- **Landing Page:** `http://localhost:3001/landing/ABC123` (replace `ABC123` with your unique ID)
- **Workflow Page:** `http://localhost:3001/workflow/ABC123` (replace `ABC123` with your unique ID)

### API Endpoints

#### 1. Fetch Landing Page Data

- **URL:** `GET /api/landing?id=ABC123`
- **Response:**
  ```json
  {
    "id": 1,
    "landing_page_id": "ABC123",
    "partner_logo_url": "https://example.com/partner-logo.png",
    "primary_header": "Welcome to Our Landing Page",
    "subheader": "This is a dynamic landing page.",
    "loom_url": "https://www.loom.com/share/VIDEO_ID",
    "features_list": "[\"Feature 1\", \"Feature 2\"]",
    "brand_color": "#FF5733",
    "workflow_chart": "flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]",
    "workflow_name": "Cidi Labs Revenue Innovator",
    "revenue_impact_summary": "Direct impact: 25% reduction in customer onboarding time, 20% increase in cross-sell success rate, projected $3M annual revenue uplift.",
    "gtm_challenge_addressed": "Revenue generation through optimized customer onboarding and cross-sell opportunities\n\nAddressing inefficiencies in lead qualification, customer activation timelines, and missed cross-sell opportunities that impact overall revenue growth and customer lifetime value.",
    "target_gtm_metrics_improved": "25%\nOnboarding Time Reduction\n20%\nCross-sell Conversion Rate\n$3M\nAnnual Revenue Growth",
    "in_depth_workflow_breakdown": "### Phase 1: Lead Qualification and Assignment\n**Trigger:** New lead enters CRM via Purchase Order or Email\n**Process:** AI analyzes fit based on historical data and current needs\n**AI Component:** Predictive modeling using Cidi Labs' historical engagement data\n**Data Sources:** CRM, Customer Success Portal\n**Decision Logic:** If Lead Fit Score >75%, assign to Brad or Mike for engagement\n**Output:** Lead assigned and engaged by appropriate team member\n\n### Phase 2: Customer Onboarding\n**Trigger:** Successful lead engagement confirmed via Kick-Off Call\n**Process:** Customer Success team coordinates activation and setup\n**AI Component:** Automated scheduling and resource allocation for onboarding\n**Data Sources:** CRM, Canvas API\n**Decision Logic:** Onboarding process adjusted based on lead engagement and feedback\n**Output:** Applications activated in cloud and installed in Canvas\n\n### Phase 3: Cross-Sell and Account Expansion\n**Trigger:** Post-onboarding Customer Success follow-up\n**Process:** Identify cross-sell opportunities based on current product usage\n**AI Component:** Opportunity scoring and personalized proposal generation\n**Data Sources:** CRM, Product Usage Logs, Customer Feedback\n**Decision Logic:** If cross-sell potential score >80%, initiate proposal\n**Output:** Cross-sell proposals delivered and deals closed\n\n### Integration Architecture\n- CRM integration with Canvas for real-time data synchronization\n- AI-driven analytics embedded within CRM for opportunity scoring\n\n### Success Measurement Framework\n- Reduction in onboarding duration monitored weekly\n- Cross-sell conversion rates tracked monthly\n- Revenue growth assessed quarterly\n\n### ROI Projection\n- Investment in AI capabilities and integration expected to yield 25% ROI within the first year through operational efficiencies and increased sales potential."
  }
  ```

#### 2. Create or Update Landing Page Data

- **URL:** `POST /api/landing`
- **Request Body:**
  ```json
  {
    "landing_page_id": "ABC123",
    "partner_logo_url": "https://example.com/partner-logo.png",
    "primary_header": "Welcome to Our Landing Page",
    "subheader": "This is a dynamic landing page.",
    "loom_url": "https://www.loom.com/share/VIDEO_ID",
    "features_list": "[\"Feature 1\", \"Feature 2\"]",
    "brand_color": "#FF5733",
    "workflow_chart": "flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]",
    "workflow_name": "Cidi Labs Revenue Innovator",
    "revenue_impact_summary": "Direct impact: 25% reduction in customer onboarding time, 20% increase in cross-sell success rate, projected $3M annual revenue uplift.",
    "gtm_challenge_addressed": "Revenue generation through optimized customer onboarding and cross-sell opportunities\n\nAddressing inefficiencies in lead qualification, customer activation timelines, and missed cross-sell opportunities that impact overall revenue growth and customer lifetime value.",
    "target_gtm_metrics_improved": "25%\nOnboarding Time Reduction\n20%\nCross-sell Conversion Rate\n$3M\nAnnual Revenue Growth",
    "in_depth_workflow_breakdown": "### Phase 1: Lead Qualification and Assignment\n**Trigger:** New lead enters CRM via Purchase Order or Email\n**Process:** AI analyzes fit based on historical data and current needs\n**AI Component:** Predictive modeling using Cidi Labs' historical engagement data\n**Data Sources:** CRM, Customer Success Portal\n**Decision Logic:** If Lead Fit Score >75%, assign to Brad or Mike for engagement\n**Output:** Lead assigned and engaged by appropriate team member\n\n### Phase 2: Customer Onboarding\n**Trigger:** Successful lead engagement confirmed via Kick-Off Call\n**Process:** Customer Success team coordinates activation and setup\n**AI Component:** Automated scheduling and resource allocation for onboarding\n**Data Sources:** CRM, Canvas API\n**Decision Logic:** Onboarding process adjusted based on lead engagement and feedback\n**Output:** Applications activated in cloud and installed in Canvas\n\n### Phase 3: Cross-Sell and Account Expansion\n**Trigger:** Post-onboarding Customer Success follow-up\n**Process:** Identify cross-sell opportunities based on current product usage\n**AI Component:** Opportunity scoring and personalized proposal generation\n**Data Sources:** CRM, Product Usage Logs, Customer Feedback\n**Decision Logic:** If cross-sell potential score >80%, initiate proposal\n**Output:** Cross-sell proposals delivered and deals closed\n\n### Integration Architecture\n- CRM integration with Canvas for real-time data synchronization\n- AI-driven analytics embedded within CRM for opportunity scoring\n\n### Success Measurement Framework\n- Reduction in onboarding duration monitored weekly\n- Cross-sell conversion rates tracked monthly\n- Revenue growth assessed quarterly\n\n### ROI Projection\n- Investment in AI capabilities and integration expected to yield 25% ROI within the first year through operational efficiencies and increased sales potential."
  }
  ```
- **Response (Create):**
  ```json
  {
    "message": "Landing page data created successfully",
    "landing_page_id": "ABC123",
    "id": 2
  }
  ```
- **Response (Update):**
  ```json
  {
    "message": "Landing page data updated successfully",
    "landing_page_id": "ABC123",
    "id": 1
  }
  ```

### Workflow Chart Format

The `workflow_chart` field accepts Mermaid flowchart syntax. Example:

```
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

### Workflow Fields Format

#### workflow_name

A string containing the workflow name/subtitle (e.g., "Cidi Labs Revenue Innovator")

#### revenue_impact_summary

A string describing the direct revenue impact of the workflow (e.g., "Direct impact: 25% reduction in customer onboarding time, 20% increase in cross-sell success rate, projected $3M annual revenue uplift.")

#### gtm_challenge_addressed

A string describing the GTM challenge being addressed. Can include line breaks using `\n`.

#### target_gtm_metrics_improved

A string with metrics in the format:

```
25%
Onboarding Time Reduction
20%
Cross-sell Conversion Rate
$3M
Annual Revenue Growth
```

#### in_depth_workflow_breakdown

A markdown-style string with the following format:

```
### Phase 1: Lead Qualification and Assignment
**Trigger:** New lead enters CRM via Purchase Order or Email
**Process:** AI analyzes fit based on historical data and current needs
**AI Component:** Predictive modeling using Cidi Labs' historical engagement data
**Data Sources:** CRM, Customer Success Portal
**Decision Logic:** If Lead Fit Score >75%, assign to Brad or Mike for engagement
**Output:** Lead assigned and engaged by appropriate team member

### Phase 2: Customer Onboarding
**Trigger:** Successful lead engagement confirmed via Kick-Off Call
**Process:** Customer Success team coordinates activation and setup
**AI Component:** Automated scheduling and resource allocation for onboarding
**Data Sources:** CRM, Canvas API
**Decision Logic:** Onboarding process adjusted based on lead engagement and feedback
**Output:** Applications activated in cloud and installed in Canvas

### Integration Architecture
- CRM integration with Canvas for real-time data synchronization
- AI-driven analytics embedded within CRM for opportunity scoring

### Success Measurement Framework
- Reduction in onboarding duration monitored weekly
- Cross-sell conversion rates tracked monthly
- Revenue growth assessed quarterly

### ROI Projection
- Investment in AI capabilities and integration expected to yield 25% ROI within the first year through operational efficiencies and increased sales potential.
```

## Troubleshooting

- **Port Conflicts:** Ensure no other services are using ports 3000 or 3001.
- **Database Connection:** Verify your database credentials and ensure the database is running.
- **Docker Issues:** Check Docker logs for errors.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
