// const SNO = artifacts.require("SocialNetworkOwnership");
const OWW = artifacts.require("OwnedWords");

module.exports = async function (deployer) {
  await deployer.deploy(OWW);
};
