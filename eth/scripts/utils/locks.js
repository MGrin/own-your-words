const fs = require("fs");
const getLockName = (network, name) => `${name}.${network}.json`;
const LOCK_STORAGE = "./locks";
const REQUIRE_LOCK_STORAGE = "../../locks";

const writeLock = (network, name, address) => {
  const lockPath = `${LOCK_STORAGE}/${getLockName(network, name)}`;

  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
  }

  fs.writeFileSync(
    lockPath,
    JSON.stringify({
      address: address,
      name: name,
      timestamp: new Date().getTime(),
    })
  );
};

const verifyNoLock = (network, name) => {
  const lockPath = `${LOCK_STORAGE}/${getLockName(network, name)}`;

  if (fs.existsSync(lockPath)) {
    throw new Error("Contract already deployed");
  }
};

const getLock = (network, name) => {
  try {
    const lock = require(`${REQUIRE_LOCK_STORAGE}/${getLockName(
      network,
      name
    )}`);
    return lock;
  } catch (err) {
    throw new Error("Contract has never been deployed");
  }
};

module.exports = {
  writeLock,
  verifyNoLock,
  getLock,
};
