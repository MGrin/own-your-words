const { getLock } = require("../scripts/utils/locks");

const NAME = "OwnYourSocialNetwork";

task("isOWSNAvailable", "Is OWSN available by snName and snId")
  .addParam("name", "SN Name")
  .addParam("id", "SN id")
  .setAction(async ({ name, id }, hre) => {
    const owsnLock = getLock(network.name, NAME);
    const OWSN = await hre.ethers.getContractFactory(NAME);
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.isAvailable(name, id));
  });

task("getOWSNToken", "Get OWSN Token by id")
  .addParam("token", "OWSN token id")
  .setAction(async ({ token }, hre) => {
    const owsnLock = getLock(network.name, NAME);
    const OWSN = await hre.ethers.getContractFactory(NAME);
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.getOWSNByTokenId(token));
  });

task("OWSNTotalSupply", "Get OWSN total supply").setAction(async (_, hre) => {
  const owsnLock = getLock(network.name, NAME);
  const OWSN = await hre.ethers.getContractFactory(NAME);
  const owsn = await OWSN.attach(owsnLock.address);
  console.log((await owsn.totalSupply()).toString());
});
