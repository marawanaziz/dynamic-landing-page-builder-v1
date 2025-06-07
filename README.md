# Dynamic Landing Page Project

## Overview

This project builds a customizable landing page that dynamically loads content based on a unique identifier passed as a URL parameter. The page fetches personalized content from a MySQL database while maintaining a consistent structure and branding.

## Features

- **Dynamic Content:** Loads personalized content based on a unique ID.
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

### 5. Run with Docker

```bash
docker-compose up --build
```

This will start the backend, frontend, and MySQL database.

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

## Usage

### Access the Landing Page

- Open your browser and navigate to `http://localhost:3001/landing?id=ABC123` (replace `ABC123` with your unique ID).

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
    "brand_color": "#FF5733"
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
    "brand_color": "#FF5733"
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

## Troubleshooting

- **Port Conflicts:** Ensure no other services are using ports 3000 or 3001.
- **Database Connection:** Verify your database credentials and ensure the database is running.
- **Docker Issues:** Check Docker logs for errors.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
