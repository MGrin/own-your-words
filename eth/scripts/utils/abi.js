const fs = require("fs");
const CONTRACTS_PATH = "../../artifacts/contracts";
const WEB_PATH = "../web";
const API_PATH = "../api";

const populateAbiToWeb = (name, pathPrefix) => {
  if (!fs.existsSync(WEB_PATH)) {
    throw new Error(`Web project is not found at ${WEB_PATH}`);
  }

  const abi = require(`${CONTRACTS_PATH}/${
    pathPrefix || ""
  }${name}.sol/${name}.json`);
  fs.writeFileSync(`${WEB_PATH}/src/abi/${name}.json`, JSON.stringify(abi));
};

const populateAbiToApi = (name, pathPrefix) => {
  if (!fs.existsSync(API_PATH)) {
    throw new Error(`API project is not found at ${API_PATH}`);
  }

  const abi = require(`${CONTRACTS_PATH}/${
    pathPrefix || ""
  }${name}.sol/${name}.json`);
  fs.writeFileSync(`${API_PATH}/src/abi/${name}.json`, JSON.stringify(abi));
};

const replaceAddressInWeb = (network, symbol, address) => {
  if (!fs.existsSync(WEB_PATH)) {
    throw new Error(`Web project is not found at ${WEB_PATH}`);
  }

  const envFilePath = `${WEB_PATH}/.env`;

  const existingEnvContent = fs.readFileSync(envFilePath).toString("utf-8");
  const reToReplace = new RegExp(
    `REACT_APP_${symbol}_CONTRACT_${network.toUpperCase()}=.*`
  );
  const valueToInsert = `REACT_APP_${symbol}_CONTRACT_${network.toUpperCase()}=${address}`;
  const replacedEnvContent = existingEnvContent.replace(
    reToReplace,
    valueToInsert
  );

  fs.unlinkSync(envFilePath);
  fs.writeFileSync(envFilePath, replacedEnvContent);
};

module.exports = {
  populateAbiToWeb,
  populateAbiToApi,
  replaceAddressInWeb,
};
