const handleOffChainError = (error) => {
  console.error("Error:", error);
};

const mayFail = async (contract, method, ...args) => {
  console.log(method, args);
  try {
    await contract.callStatic[method](...args);
  } catch (err) {
    throw err;
  }

  return contract[method](...args);
};

module.exports = {
  handleOffChainError,
  mayFail,
};
