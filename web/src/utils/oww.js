export const transformTokenIDToOWW = async (tokenId, account, contract) => {
  const promises = [
    contract.methods.tokenURI(tokenId).call({ sender: account }),
    contract.methods.getPostUrl(tokenId).call({ sender: account }),
  ];

  const data = await Promise.all(promises);

  return {
    tokenId,
    metadataURI: data[0],
    postURL: data[1],
  };
};

export const fetchOwnedTokens = async (account, contract) => {
  const tokenIds = await contract.methods.getTokens().call({ from: account });
  const owwPromises = tokenIds.map((tokenId) =>
    transformTokenIDToOWW(tokenId, account, contract)
  );
  const owws = await Promise.all(owwPromises);
  return owws;
};
