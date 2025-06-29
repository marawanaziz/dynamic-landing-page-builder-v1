-- Migration: Add workflow fields to landing_pages table
-- Date: 2024-01-XX
-- Description: Adds new workflow-related fields to support the workflow page functionality

-- Add workflow_name column
ALTER TABLE landing_pages 
ADD COLUMN workflow_name VARCHAR(255) NULL 
AFTER workflow_chart;

-- Add revenue_impact_summary column
ALTER TABLE landing_pages 
ADD COLUMN revenue_impact_summary TEXT NULL 
AFTER workflow_name;

-- Add gtm_challenge_addressed column
ALTER TABLE landing_pages 
ADD COLUMN gtm_challenge_addressed TEXT NULL 
AFTER revenue_impact_summary;

-- Add target_gtm_metrics_improved column
ALTER TABLE landing_pages 
ADD COLUMN target_gtm_metrics_improved TEXT NULL 
AFTER gtm_challenge_addressed;

-- Add in_depth_workflow_breakdown column
ALTER TABLE landing_pages 
ADD COLUMN in_depth_workflow_breakdown TEXT NULL 
AFTER target_gtm_metrics_improved; 