require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "deposit",
  "Send 3 ETH to deployer and mgrin.eth",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    await accounts[0].sendTransaction({
      to: "0x01583D152E3225519D211B1F576d959F70ef9630",
      value: ethers.utils.parseEther("1.0"),
    });
  }
);

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
