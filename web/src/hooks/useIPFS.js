import { createContext, useContext, useMemo } from "react";
import { NFTStorage } from "nft.storage";
import { NFT_STORAGE_API_KEY } from "../utils/constants";

const context = createContext();

export const IPFSProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      ipfs: new NFTStorage({
        token: NFT_STORAGE_API_KEY,
      }),
    }),
    []
  );
  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useIPFS = () => {
  useContext(context);
};
