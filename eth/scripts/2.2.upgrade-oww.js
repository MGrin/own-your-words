const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils/locks");
const { populateAbiToApi } = require("./utils/abi");
const { replaceAddressInApi } = require("./utils/env");
const { getBaseUri } = require("./utils/baseUri");

async function main() {
  const NAME = "OwnYourWords";
  const SYMBOL = "OWW";

  const OwnYourWords = await ethers.getContractFactory(NAME);

  const tpm = getLock(network.name, "TwitterPostMinter");
  const existingDeployment = getLock(network.name, NAME);

  const oww = await upgrades.upgradeProxy(
    existingDeployment.address,
    OwnYourWords,
    [NAME, SYMBOL, getBaseUri(network.name)]
  );
  await oww.deployed();
  await oww.setTwitterPostMinterAddress(tpm.address);
  await oww.setBaseURI(getBaseUri(network.name));

  writeLock(network.name, NAME, oww.address);
  console.log(`${NAME} deployed to:`, oww.address);

  populateAbiToApi(NAME, SYMBOL, undefined, network.name);
  replaceAddressInApi(SYMBOL, oww.address, network.name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
