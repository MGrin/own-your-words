const { getLock } = require("../scripts/utils/locks");

const NAME = "OwnYourWords";

task("isOWWAvailable", "Is OWW available by gensnid")
  .addParam("gensnid", "OWW gensnid")
  .setAction(async ({ gensnid }, hre) => {
    const owwLock = getLock(network.name, NAME);
    const OWW = await hre.ethers.getContractFactory(NAME);
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.isPostAvailable(gensnid));
  });

task("getOWWToken", "Get OWW Token by id")
  .addParam("token", "OWW token id")
  .setAction(async ({ token }, hre) => {
    const owwLock = getLock(network.name, NAME);
    const OWW = await hre.ethers.getContractFactory(NAME);
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.getOWWByTokenId(token));
  });
