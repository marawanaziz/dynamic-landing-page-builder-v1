const fs = require("fs");
const path = require("path");
const db = require("./db");

// Migration tracking table creation
const createMigrationsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Migrations table created/verified");
  } catch (error) {
    console.error("❌ Error creating migrations table:", error);
    throw error;
  }
};

// Get list of executed migrations
const getExecutedMigrations = async () => {
  try {
    const [rows] = await db.query("SELECT migration_name FROM migrations");
    return rows.map((row) => row.migration_name);
  } catch (error) {
    console.error("❌ Error getting executed migrations:", error);
    return [];
  }
};

// Mark migration as executed
const markMigrationExecuted = async (migrationName) => {
  try {
    await db.query("INSERT INTO migrations (migration_name) VALUES (?)", [
      migrationName,
    ]);
    console.log(`✅ Marked migration ${migrationName} as executed`);
  } catch (error) {
    console.error(
      `❌ Error marking migration ${migrationName} as executed:`,
      error
    );
    throw error;
  }
};

// Execute a single migration
const executeMigration = async (migrationPath) => {
  try {
    const migrationContent = fs.readFileSync(migrationPath, "utf8");
    const statements = migrationContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }

    console.log(`✅ Executed migration: ${path.basename(migrationPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing migration ${migrationPath}:`, error);
    return false;
  }
};

// Main migration function
const runMigrations = async () => {
  try {
    console.log("🚀 Starting database migrations...");

    // Create migrations table if it doesn't exist
    await createMigrationsTable();

    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations();

    // Get all migration files
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("📁 No migrations directory found, creating...");
      fs.mkdirSync(migrationsDir, { recursive: true });
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Sort to ensure order

    console.log(`📋 Found ${migrationFiles.length} migration files`);

    let executedCount = 0;

    for (const migrationFile of migrationFiles) {
      const migrationName = path.basename(migrationFile, ".sql");

      if (executedMigrations.includes(migrationName)) {
        console.log(`⏭️  Skipping ${migrationName} (already executed)`);
        continue;
      }

      console.log(`🔄 Executing migration: ${migrationName}`);
      const migrationPath = path.join(migrationsDir, migrationFile);

      const success = await executeMigration(migrationPath);

      if (success) {
        await markMigrationExecuted(migrationName);
        executedCount++;
      } else {
        console.error(`❌ Failed to execute migration: ${migrationName}`);
        process.exit(1);
      }
    }

    if (executedCount === 0) {
      console.log("✅ All migrations are up to date");
    } else {
      console.log(`✅ Successfully executed ${executedCount} migration(s)`);
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.end();
  }
};

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
