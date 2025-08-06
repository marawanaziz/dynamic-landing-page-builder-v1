import React from "react";

const VideoCard = () => (
  <>
    <div className="video-card">
      <div className="video-section">
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
      <div className="content-section">
        <h2 className="content-header">
          How Outreachify Scaled to 100+ Campaigns Without Hiring Additional
          Staff
        </h2>
        <p className="content-subheader">
          See how Harsh saved 16 hours per week, replaced a $3,000/month data
          analyst, and gained the confidence to take on more clients using our
          MCP solution. Rated 10/10 and recommended to every B2B agency.
        </p>
      </div>
    </div>
    <div style={{ textAlign: "center", marginTop: 40, marginBottom: "40px" }}>
      <a href="#calendly" className="cta-button">
        Schedule Your Strategy Call
      </a>
    </div>
  </>
);

export default VideoCard;
