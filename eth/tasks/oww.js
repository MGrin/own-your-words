const { getLock } = require("../scripts/utils/locks");

const NAME = "OwnYourWords";

task("isOWWAvailable", "Is OWW available by snName and snId")
  .addParam("name", "SN name")
  .addParam("id", "SN id")
  .setAction(async ({ name, id }, hre) => {
    const owwLock = getLock(network.name, NAME);
    const OWW = await hre.ethers.getContractFactory(NAME);
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.isAvailable(name, id));
  });

task("getOWWToken", "Get OWW Token by id")
  .addParam("token", "OWW token id")
  .setAction(async ({ token }, hre) => {
    const owwLock = getLock(network.name, NAME);
    const OWW = await hre.ethers.getContractFactory(NAME);
    const oww = await OWW.attach(owwLock.address);
    console.log(await oww.getOWWByTokenId(token));
  });

task("OWWTotalSupply", "Get OWW total supply").setAction(async (_, hre) => {
  const owwLock = getLock(network.name, NAME);
  const OWW = await hre.ethers.getContractFactory(NAME);
  const oww = await OWW.attach(owwLock.address);
  console.log((await oww.totalSupply()).toString());
});
