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
        OWSN_CONTRACT_LOCALHOST: '0x6106391a6Eb7fc6096d2341875EA4705152096aA',
        TM_CONTRACT_LOCALHOST: '0xc03A37Ca41f49eb4f8cC703D43a2cD674e307F91',
        TAO_CONTRACT_LOCALHOST: '0x6f1F04C40E46652946E0dD451a6089A2c1678117',
        OWW_CONTRACT_LOCALHOST: '0xa8F734AABc0E4e3DfCB7e9E0FeEFD912C60eE7C2',
        TPM_CONTRACT_LOCALHOST: '0xf6234A998E03939bB09d88d8D9612dBcbB4B4A62',
        TPO_CONTRACT_LOCALHOST: '0xF7B8E8975159bBa35FA8519C5CfC857F302CF0E2',
        OWSN_CONTRACT_RINKEBY: '0xc82a6E4Bf2950957bcFC837e8F37B038BF6f5624',
        TM_CONTRACT_RINKEBY: '0x45f2e1C513A1B9c394f278E4f0783CA3c3502802',
        TAO_CONTRACT_RINKEBY: '0x20986eA012a35Ae644B4e5A7E8756dbd0bA730Fe',
        OWW_CONTRACT_RINKEBY: '',
        TPM_CONTRACT_RINKEBY: '',
        TPO_CONTRACT_RINKEBY: '',
        OWSN_CONTRACT_HOMESTEAD: '',
        TM_CONTRACT_HOMESTEAD: '',
        TAO_CONTRACT_HOMESTEAD: '',
        OWW_CONTRACT_HOMESTEAD: '',
        TPM_CONTRACT_HOMESTEAD: '',
        TPO_CONTRACT_HOMESTEAD: '',
        TAO_REQUESTS_PULL_TIMEOUT_SECONDS: 10,
        RPC_PROVIDER_URL: process.env.RPC_PROVIDER_URL,
        ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
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
