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
        {
          privateKey: `0x${process.env.DEPLOYER_PRIVATE_KEY.substring(
            0,
            process.env.DEPLOYER_PRIVATE_KEY.length - 8
          )}00000000`,
          balance: `${10 * 1e18}`,
        },
      ],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
