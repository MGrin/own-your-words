export const getGatewayURL = (ipfsURL) => {
  const url = new URL(ipfsURL);
  const cid = url.pathname.substring(2).split("/")[0];
  const file = url.pathname.substring(2).split("/")[1];

  return `https://gateway.ipfs.io/ipfs/${cid}/${file}`;
};
