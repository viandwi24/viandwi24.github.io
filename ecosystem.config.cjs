module.exports = {
  apps: [
    {
      name: "viandwi24.com",
      script: "bun",
      args: "preview",
      env: {
        "PORT": 3001,
        "BASE_URL": "https://viandwi24.com",
        "NUXT_PUBLIC_BASE_URL": "https://viandwi24.com",
        "NODE_ENV": "production"
      }
    }
  ]
};