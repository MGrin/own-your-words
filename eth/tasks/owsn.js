const { getLock } = require("../scripts/utils/locks");

const NAME = "OwnYourSocialNetwork";

task("isOWSNAvailable", "Is OWSN available by gensnid")
  .addParam("gensnid", "OWSN gensnid")
  .setAction(async ({ gensnid }, hre) => {
    const owsnLock = getLock(network.name, NAME);
    const OWSN = await hre.ethers.getContractFactory(NAME);
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.isAccountAvailable(gensnid));
  });

task("getOWSNToken", "Get OWSN Token by id")
  .addParam("token", "OWSN token id")
  .setAction(async ({ token }, hre) => {
    const owsnLock = getLock(network.name, NAME);
    const OWSN = await hre.ethers.getContractFactory(NAME);
    const owsn = await OWSN.attach(owsnLock.address);
    console.log(await owsn.getOWSNByTokenId(token));
  });
