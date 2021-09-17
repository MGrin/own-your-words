import { createContext, useContext, useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import Web3 from "web3";
import { NFTStorage } from "nft.storage";
import abi from "../abi.json";

const context = createContext();

export const OWWProvider = ({ children }) => {
  const { library, account } = useEthers();
  const [value, setValue] = useState();

  useEffect(() => {
    if (!library || !account) {
      return;
    }
    const web3 = new Web3(library.provider);
    const contract = new web3.eth.Contract(
      abi.abi,
      process.env.REACT_APP_OWW_CONTRACT
    );
    const nftStorageClient = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
    });

    setValue({
      web3,
      contract,
      nftStorageClient,
    });
  }, [account, library]);

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useOWW = () => {
  const value = useContext(context);
  return value ? value.contract : undefined;
};

export const useNFTStorage = () => {
  const value = useContext(context);
  return value ? value.nftStorageClient : undefined;
};
