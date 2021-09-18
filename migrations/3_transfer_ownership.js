const { admin } = require("@openzeppelin/truffle-upgrades");

const gnosisSafeAddresses = {
  rinkeby: "0x212375cD55d89e447DA628cbf89a6F2653e7F892",
};

module.exports = async function (deployer, network) {
  // Use address of your Gnosis Safe
  const gnosisSafe = gnosisSafeAddresses[network];
  if (!gnosisSafe) {
    return;
  }

  await admin.transferProxyAdminOwnership(gnosisSafe);
};
