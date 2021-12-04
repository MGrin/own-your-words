const getBaseUri = (network) => {
  switch (network) {
    case "localhost": {
      return "http://localhost:4001/";
    }
    case "rinkeby": {
      return "https://bbadsh7q3pqrt2iainf0.containers.yandexcloud.net/";
    }
    default: {
      throw new Error(`BaseURI is not yet defined for ${network}!`);
    }
  }
};

module.exports = {
  getBaseUri,
};
