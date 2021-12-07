const getBaseUri = (network) => {
  switch (network) {
    case "localhost": {
      return "http://localhost:4001/";
    }
    case "rinkeby": {
      return "https://rinkeby.oww-api.famio.app/";
    }
    default: {
      throw new Error(`BaseURI is not yet defined for ${network}!`);
    }
  }
};

module.exports = {
  getBaseUri,
};
