module.exports = {
  apps: [
    {
      name: 'oww-api',
      script: 'yarn',
      args: 'start:prod',
      autorestart: true,
      watch: false,
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
        OWSN_CONTRACT_LOCALHOST: '0xdf81693d168D1FC91d371730c426dA480f879b26',
        TM_CONTRACT_LOCALHOST: '0x12Ed5216Bec3bb5dcb844fd6D097b5e69020518C',
        TAO_CONTRACT_LOCALHOST: '0x9f0Afc6f8DB628Ab04c1d690a982ae3b83ABB59F',
        OWSN_CONTRACT_RINKEBY: '0xc82a6E4Bf2950957bcFC837e8F37B038BF6f5624',
        TM_CONTRACT_RINKEBY: '0x45f2e1C513A1B9c394f278E4f0783CA3c3502802',
        TAO_CONTRACT_RINKEBY: '0x20986eA012a35Ae644B4e5A7E8756dbd0bA730Fe',
        OWSN_CONTRACT_HOMESTEAD: '',
        TM_CONTRACT_HOMESTEAD: '',
        TAO_CONTRACT_HOMESTEAD: '',
        TAO_REQUESTS_PULL_TIMEOUT_SECONDS: 10,
        RPC_PROVIDER_URL: process.env.RPC_PROVIDER_URL,
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
