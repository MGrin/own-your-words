const fs = require("fs");
const CONTRACTS_PATH = "../../artifacts/contracts";
const API_PATH = "../api";

const populateAbiToApi = (name, symbol, pathPrefix, network) => {
  if (!fs.existsSync(API_PATH)) {
    throw new Error(`API project is not found at ${API_PATH}`);
  }

  const abi = require(`${CONTRACTS_PATH}/${
    pathPrefix || ""
  }${name}.sol/${name}.json`);
  fs.writeFileSync(
    `${API_PATH}/src/abi/${network}/${symbol}.json`,
    JSON.stringify(abi)
  );
};

module.exports = {
  populateAbiToApi,
};
