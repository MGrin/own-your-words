const { ethers, upgrades, network } = require("hardhat");
const { writeLock, verifyNoLock, getLock } = require("./utils");

async function main() {
  const NAME = "OwnYourSocialNetwork";
  verifyNoLock(network.name, NAME);

  const OwnYourSocialNetwork = await ethers.getContractFactory(NAME);

  const taoLock = getLock(network.name, "TwitterAuthOracle");

  const owsn = await upgrades.deployProxy(
    OwnYourSocialNetwork,
    [NAME, "OWSN", taoLock.address],
    { initializer: "__OwnYourSocialNetwork__init" }
  );
  await owsn.deployed();

  writeLock(network.name, NAME, owsn.address);
  console.log(`${NAME} deployed to:`, owsn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
