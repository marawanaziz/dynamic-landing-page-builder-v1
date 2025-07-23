import React from "react";

const VideoCard = () => (
  <div
    className="video-card"
    style={{
      maxWidth: 1200,
      margin: "60px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: 0,
      minHeight: 400,
    }}
  >
    <div
      className="video-section"
      style={{
        flex: 1,
        background: "#000",
        position: "relative",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <iframe
        className="youtube-embed"
        src="https://www.youtube.com/embed/aXsYSq5XYDM"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
    <div
      className="content-section"
      style={{
        flex: 1,
        padding: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        className="content-header"
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#2c2c2c",
          lineHeight: 1.2,
          marginBottom: 20,
          fontFamily: "Arial, sans-serif",
        }}
      >
        How Outreachify Scaled to 100+ Campaigns Without Hiring Additional Staff
      </h2>
      <p
        className="content-subheader"
        style={{
          fontSize: "1.2rem",
          color: "#666",
          lineHeight: 1.6,
          fontWeight: 400,
          fontFamily: "Arial, sans-serif",
        }}
      >
        See how Harsh saved 16 hours per week, replaced a $3,000/month data
        analyst, and gained the confidence to take on more clients using our MCP
        solution. Rated 10/10 and recommended to every B2B agency.
      </p>
    </div>
  </div>
);

export default VideoCard;
