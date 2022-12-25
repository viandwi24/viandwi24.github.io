module.exports = {
  apps: [
    {
      name: 'Portfolio',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    }
  ]
}
