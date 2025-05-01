module.exports = {
  apps: [{
    name: 'easyfix',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
} 