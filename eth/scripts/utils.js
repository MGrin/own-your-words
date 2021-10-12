const fs = require("fs");
const getLockName = (network, name) => `${name}.${network}.json`;
const LOCK_STORAGE = "./locks";

const writeLock = (network, name, address) => {
  const lockPath = `${LOCK_STORAGE}/${getLockName(network, name)}`;

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
  const lock = require(`.${LOCK_STORAGE}/${getLockName(network, name)}`);
  return lock;
};

module.exports = {
  writeLock,
  verifyNoLock,
  getLock,
};
