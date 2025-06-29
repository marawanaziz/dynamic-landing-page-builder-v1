# Database Migrations

This directory contains database migration files that automatically update the database schema when the application is deployed.

## How It Works

1. **Automatic Execution**: Migrations run automatically when the server starts
2. **Tracking**: The system tracks which migrations have been executed in a `migrations` table
3. **Idempotent**: Migrations can be run multiple times safely - they only execute once
4. **Ordered**: Migrations are executed in alphabetical order by filename

## Migration Files

### 001_add_workflow_fields.sql

- **Date**: 2024-01-XX
- **Description**: Adds workflow-related fields to support the new workflow page functionality
- **Changes**:
  - Adds `workflow_name` column
  - Adds `revenue_impact_summary` column
  - Adds `gtm_challenge_addressed` column
  - Adds `target_gtm_metrics_improved` column
  - Adds `in_depth_workflow_breakdown` column

## Creating New Migrations

1. Create a new SQL file in this directory with the format: `XXX_description.sql`
2. Use sequential numbers (001, 002, 003, etc.) to ensure proper ordering
3. Include a header comment with date and description
4. Write your ALTER TABLE statements
5. The migration will run automatically on the next server restart

## Manual Migration Commands

```bash
# Run migrations manually
npm run migrate

# Check migration status
npm run migrate:status

# Setup database and start server
npm run setup
```

## Migration Best Practices

1. **Always backup** your database before running migrations
2. **Test migrations** on a development database first
3. **Use descriptive names** for migration files
4. **Include rollback instructions** in comments if needed
5. **Keep migrations small** and focused on a single change

## Troubleshooting

If a migration fails:

1. Check the error message in the console
2. Verify your SQL syntax
3. Ensure the database connection is working
4. Check if the migration conflicts with existing data

The migration system will prevent the server from starting if migrations fail, ensuring data integrity.
