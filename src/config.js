module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL1: process.env.DB_URL1 || "postgresql://dunder-mifflin:paper@localhost/blogful",
  DB_URL2: process.env.DB_URL2 || "postgresql://dunder-mifflin:paper@localhost/bookmarks",
  SKIP_AUTH: process.env.SKIP_AUTH || true
}