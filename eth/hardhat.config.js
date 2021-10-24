require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
require("./tasks.js");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey: `0x${process.env.DEPLOYER_PRIVATE_KEY}`,
          balance: `${10 * 1e18}`,
        },
      ],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
};
