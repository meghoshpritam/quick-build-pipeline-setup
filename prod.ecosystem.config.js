module.exports = {
  apps: [
    {
      name: 'quick-build-pipeline-setup',
      script: './build/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: 4125,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4125,
      },
    },
  ],
};
