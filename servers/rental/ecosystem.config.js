module.exports = {
  apps: [
    {
      name: 'rental-server',
      script: './dist/index.js',
      watch: ['dist'],
      ignore_watch: ['node_modules', 'src'],
      // wait_ready: true,
      // listen_timeout: 20000,
      instances: 1,
      node_args: '-r dotenv/config',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
    },
  ],
}