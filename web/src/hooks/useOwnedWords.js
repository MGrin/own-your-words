import { createContext, useContext, useEffect, useMemo, useState } from "react";
import owwAbi from "../abi/OwnYourWords.json";
import owsnAbi from "../abi/OwnYourSocialNetwork.json";
import tmAbi from "../abi/TwitterMinter.json";

import { useWeb3, CHAINS } from "./useWeb3";
import {
  getOWWContractAddress,
  getOWSNContractAddress,
} from "../utils/constants";

const loadOWWContract = async (library, account) => {
  if (!owwAbi.abi || !library) {
    return;
  }

  const owwContract = new library.eth.Contract(
    owwAbi.abi,
    getOWWContractAddress(CHAINS[library.givenProvider.networkVersion])
  );
  const version = await owwContract.methods
    .getVersion()
    .call({ sender: account });

  window.OWW = owwContract;
  console.log(`OWW: ${version}, ${owwContract._address}`);

  return owwContract;
};

const loadOWSNContract = async (library, account) => {
  if (!owsnAbi.abi || !library) {
    return;
  }

  const owsnContract = new library.eth.Contract(
    owsnAbi.abi,
    getOWSNContractAddress(CHAINS[library.givenProvider.networkVersion])
  );
  const version = await owsnContract.methods
    .getVersion()
    .call({ sender: account });

  window.OWSN = owsnContract;
  console.log(`OWSN: ${version}, ${owsnContract._address}`);

  const tmContract = await loadTMContract(library, account, owsnContract);

  return {
    owsnContract,
    tmContract,
  };
};

const loadTMContract = async (library, account, owsnContract) => {
  if (!tmAbi.abi || !library) {
    return undefined;
  }

  const twitterMinterAddress = await owsnContract.methods
    .twitterMinter()
    .call({ sender: account });

  const tmContract = new library.eth.Contract(tmAbi.abi, twitterMinterAddress);
  const tmOracleAddress = await tmContract.methods
    .oracle()
    .call({ sender: account });

  window.TM = tmContract;
  console.log(`TM: ${tmContract._address}, using oracle at ${tmOracleAddress}`);

  return tmContract;
};

const context = createContext();

export const OWWProvider = ({ children }) => {
  const { library } = useWeb3();
  const [oww, setOWW] = useState();
  const [owsn, setOWSN] = useState();
  const [tm, setTM] = useState();

  const account = null;

  useEffect(() => {
    loadOWWContract(library, account)
      .then((contract) => {
        if (contract) {
          setOWW(contract);
        }
      })
      .catch((err) => {
        console.warning(`Failed to load the OWW contract: `, err);
      });
  }, [library, account]);

  useEffect(() => {
    loadOWSNContract(library, account)
      .then(({ owsnContract, tmContract }) => {
        if (tmContract) {
          setTM(tmContract);
        }
        setOWSN(owsnContract);
      })
      .catch((err) => {
        console.warn(`Failed to load the OWSN contract: `, err);
      });
  }, [library]);

  const value = useMemo(
    () => ({
      oww,
      owsn,
      tm,
    }),
    [oww, owsn, tm]
  );
  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useOWW = () => {
  const contextValue = useContext(context);
  return contextValue ? contextValue.oww : undefined;
};

export const useOWSN = () => {
  const { account } = useWeb3();
  const contextValue = useContext(context);

  const value = {
    owsn: !account || !contextValue ? undefined : contextValue.owsn,
    getOwnedAccountByGenSnId: async (genId) => {
      const res = await contextValue.owsn.methods
        .getOwnedAccountByGenSnId(genId)
        .call({ sender: account });
      return res;
    },
    getOwnedTokenIds: async () => {
      const balance = await contextValue.owsn.methods
        .balanceOf(account)
        .call({ sender: account });

      const tokenIdsPromises = [];
      for (let i = 0; i < balance; i++) {
        tokenIdsPromises.push(
          contextValue.owsn.methods
            .tokenOfOwnerByIndex(account, i)
            .call({ sender: account })
        );
      }

      return await Promise.all(tokenIdsPromises);
    },
    getOWSNById: async (tokenId) => {
      return await contextValue.owsn.methods
        .getOwnedAccountByToken(tokenId)
        .call({ sender: account });
    },
    mintTwitter: async (oauthToken, oauthVerifier) => {
      const price = await contextValue.tm.methods
        .getPriceWEI()
        .call({ sender: account });
      const res = await contextValue.owsn.methods
        .mintTwitter(oauthToken, oauthVerifier)
        .send({ from: account, value: price });
      return res;
    },
  };
  return value;
};

export const useTM = () => {
  const { account } = useWeb3();
  const contextValue = useContext(context);
  const value = {
    tm: !account || !contextValue ? undefined : contextValue.tm,
    getMintPrice: async () => {
      const res = await contextValue.tm.methods
        .getPriceWEI()
        .call({ sender: account });
      return res;
    },
    subscribeToEvents: async ({
      onRequestSubmitted,
      onRequestSucceeded,
      onRequestFailed,
      onError,
    }) => {
      contextValue.tm.once(
        "TwitterAuthRequestSubmited",
        ({
          filter: { address: account },
        },
        (error, data) => {
          if (error) {
            return onError(error);
          }

          onRequestSubmitted(data);
          contextValue.tm.once(
            "TwitterAuthRequestSucceeded",
            ({
              filter: { requestId: data.returnValues.requestId },
            },
            (error, data) => {
              if (error) {
                return onError(error);
              }

              onRequestSucceeded(data);
            })
          );

          contextValue.tm.once(
            "TwitterAuthRequestFailed",
            ({
              filter: { requestId: data.returnValues.requestId },
            },
            (error, data) => {
              if (error) {
                return onError(error);
              }

              return onRequestFailed(data);
            })
          );
        })
      );
    },
  };
  return value;
};
