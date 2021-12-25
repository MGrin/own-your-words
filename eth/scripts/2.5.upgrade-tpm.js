const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");

async function main() {
  const NAME = "TwitterPostMinter";
  const SYMBOL = "TPM";

  const TwitterPostMinter = await ethers.getContractFactory(NAME);

  const tpo = getLock(network.name, "TwitterPostOracle");

  const tpm = await TwitterPostMinter.deploy(tpo.address);
  await tpm.deployed();

  writeLock(network.name, NAME, tpm.address);
  console.log(`${NAME} deployed to:`, tpm.address);

  populateAbiToApi(NAME, SYMBOL, "minters/", network.name);
  replaceAddressInApi(SYMBOL, tpm.address, network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
