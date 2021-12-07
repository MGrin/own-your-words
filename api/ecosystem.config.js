module.exports = {
  apps: [
    {
      name: 'oww-api',
      script: 'node dist/main',
    },
  ],
  deploy: {
    development: {
      user: 'admin',
      key: '~/.ssh/ya_oww',
      ssh_options: 'StrictHostKeyChecking=no',
      host: '51.250.16.128',
      ref: 'origin/main',
      repo: 'https://github.com/MGrin/own-your-words.git',
      path: '/home/admin/oww-api',
      'post-deploy': `export PATH=/home/admin/.nvm/versions/node/v16.10.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/admin/.yarn/bin && \
        cd api && yarn && yarn build && \
        pm2 startOrRestart ecosystem.config.js --env development`,
      env: {
        PORT: 4000,
        NETWORK: 'rinkeby',
        TAO_CONTRACT: '0x9b26DeB2a220755A6E1264b9c14E02C393a37735',
        OWSN_CONTRACT: '0xE3f4b3a5F2b26E029D742f1Ef6D7a2Dcdbd0Db62',
        TAO_REQUESTS_PULL_TIMEOUT_SECONDS: 10,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
        TWITTER_API_KEY: process.env.TWITTER_API_KEY,
        TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
        YA_STORAGE_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
        YA_STORAGE_SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  },
};
