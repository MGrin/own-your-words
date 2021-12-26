const { getLock } = require("./scripts/utils/locks");
require("./owsn");
require("./oww");
require("./tao");
require("./tm");
require("./tpm");
require("./tpo");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("fund", "Send 1 eth to a given address")
  .addParam("to", "Address")
  .setAction(async ({ to }, hre) => {
    const accounts = await hre.ethers.getSigners();

    await accounts[0].sendTransaction({
      to,
      value: ethers.utils.parseEther("1.0"),
    });
  });

task("setOraclePrice", "Changes the oracle commission price")
  .addParam("oracle", "Oracle name")
  .addParam("price", "New price")
  .setAction(async ({ oracle, price }, hre) => {
    const accounts = await hre.ethers.getSigners();

    const Oracle = await hre.ethers.getContractFactory(oracle);
    const lock = getLock(hre.network.name, oracle);
    const oracleInstance = (await Oracle.attach(lock.address)).connect(
      accounts[0]
    );

    const ethPrice = hre.ethers.utils.parseEther(price);
    await oracleInstance.setPriceETH(ethPrice);
  });

task("getTokenUri", "Get token URI")
  .addParam("contract", "Contract name")
  .addParam("token", "Token id")
  .setAction(async ({ contract, token }, hre) => {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory(contract);
    const lock = getLock(hre.network.name, contract);
    const contractInstance = (await Contract.attach(lock.address)).connect(
      accounts[0]
    );

    console.log(await contractInstance.tokenURI(token));
  });
