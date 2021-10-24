export const API_URL = process.env.REACT_APP_API_URL || "";
export const OWW_CONTRACT_RINKEBY =
  process.env.REACT_APP_OWW_CONTRACT_RINKEBY || "";
export const OWSN_CONTRACT_RINKEBY =
  process.env.REACT_APP_OWSN_CONTRACT_RINKEBY || "";

export const OWW_CONTRACT_LOCALHOST =
  process.env.REACT_APP_OWW_CONTRACT_LOCALHOST || "";
export const OWSN_CONTRACT_LOCALHOST =
  process.env.REACT_APP_OWSN_CONTRACT_LOCALHOST || "";

export const NFT_STORAGE_API_KEY =
  process.env.REACT_APP_NFT_STORAGE_API_KEY || "";

export const TWITTER_API_KEY = process.env.REACT_APP_TWITTER_API_KEY || "";
export const TWITTER_API_SECRET =
  process.env.REACT_APP_TWITTER_API_SECRET || "";

export const ENV = process.env.NODE_ENV || "";

export const getOWWContractAddress = (network) => {
  switch (network) {
    case "localhost":
      return OWW_CONTRACT_LOCALHOST;
    case "rinkeby":
      return OWW_CONTRACT_RINKEBY;
    default:
      return "";
  }
};

export const getOWSNContractAddress = (network) => {
  switch (network) {
    case "localhost":
      return OWSN_CONTRACT_LOCALHOST;
    case "rinkeby":
      return OWSN_CONTRACT_RINKEBY;
    default:
      return "";
  }
};
