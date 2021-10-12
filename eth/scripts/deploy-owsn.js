const { ethers, upgrades, network } = require("hardhat");
const { writeLock, verifyNoLock } = require("./utils");

async function main() {
  const NAME = "OwnYourSocialNetwork";
  verifyNoLock(NAME, network.name);

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const owsn = await upgrades.deployProxy(OwnYourSocialNetwork, [NAME, "OWSN"]);
  await owsn.deployed();

  writeLock(NAME, network.name, owsn.address);
  console.log(`${NAME} deployed to:`, owsn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
