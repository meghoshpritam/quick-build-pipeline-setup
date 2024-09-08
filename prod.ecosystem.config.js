module.exports = {
  apps: [
    {
      name: 'quick-build-pipeline-setup',
      script: './build/app.js',
      watch: true,
      env: {
        PM2_SERVE_PATH: '.',
        PM2_SERVE_PORT: 4125,
      },
    },
  ],
};
