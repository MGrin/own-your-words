const { ethers, network } = require("hardhat");
const { writeLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "TwitterPostOracle";
  const SYMBOL = "TPO";
  const TwitterPostOracle = await ethers.getContractFactory(NAME);

  const tpo = await TwitterPostOracle.deploy();
  await tpo.deployed();

  writeLock(network.name, NAME, tpo.address);
  console.log(`${NAME} deployed to:`, tpo.address);
  populateAbiToApi(NAME, SYMBOL, "oracles/", network.name);
  replaceAddressInApi(SYMBOL, tpo.address, network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
