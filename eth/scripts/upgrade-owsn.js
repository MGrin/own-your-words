const { ethers, upgrades, network } = require("hardhat");
const { writeLock, getLock } = require("./utils");

async function main() {
  const NAME = "OwnYourSocialNetwork";

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const existingDeployment = getLock(NAME, network.name);

  const owsn = await upgrades.upgradeProxy(
    existingDeployment.address,
    OwnYourSocialNetwork,
    [NAME, "OWSN"]
  );
  await owsn.deployed();

  writeLock(NAME, network.name, owsn.address);
  console.log("OwnYourSocialNetwork deployed to:", owsn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });