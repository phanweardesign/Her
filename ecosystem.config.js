module.exports = {
  apps: [{
    name: "her-api",
    script: "backend/server.js",
    cwd: __dirname,
    env: { NODE_ENV: "production", PORT: 5000, APP_VERSION: "10.1.0" }
  }]
};
