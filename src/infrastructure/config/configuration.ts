export default () => ({
  // Application
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT!, 10) || 3000,

  // Database
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

  // Throttler
  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL!, 10) || 60,
    limit: parseInt(process.env.THROTTLER_LIMIT!, 10) || 10,
    ignoreUserAgents: process.env.THROTTLER_IGNORE_USER_AGENTS
      ? process.env.THROTTLER_IGNORE_USER_AGENTS.split(',')
      : [],
  },
});
