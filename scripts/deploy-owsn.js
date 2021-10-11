const { ethers, upgrades } = require("hardhat");

async function main() {
  const OwnYourSocialNetwork = await ethers.getContractFactory(
    "OwnYourSocialNetwork"
  );

  const mc = await upgrades.deployProxy(OwnYourSocialNetwork);

  await mc.deployed();
  console.log("OwnYourSocialNetwork deployed to:", mc.address);
}

main();
