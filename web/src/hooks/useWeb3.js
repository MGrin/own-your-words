import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337],
});

const context = createContext();

const Web3OWW = ({ children }) => {
  const { active, account, activate, library, deactivate, error } =
    useWeb3React();

  const [loading, setLoading] = useState(false);
  const [sweetAccount, setSweetAccount] = useState(account);

  const connect = useCallback(() => {
    setLoading(true);
    activate(injected)
      .then(() => {
        localStorage.setItem("autoConnect", "true");
      })
      .finally(() => setLoading(false));
  }, [activate]);

  const disconnect = useCallback(() => {
    setLoading(true);
    deactivate().finally(() => setLoading(false));
  }, [deactivate]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("autoConnect"))) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (!account || !active || !library) {
      return;
    }

    setSweetAccount(
      `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
      )}`
    );

    const lookup = account.toLowerCase().substr(2) + ".addr.reverse";
    library.eth.ens
      .getResolver(lookup)
      .then((resolverContract) => {
        return resolverContract.methods.name(account).call();
      })
      .then((name) => {
        console.log(name);
        if (name) {
          setSweetAccount(name);
        }
      })
      .catch((err) => {
        console.error("Failed to get ENS", err);
      });
  }, [account, active, library]);

  const value = useMemo(
    () => ({
      connected: active,
      loading,
      error,
      account,
      sweetAccount: sweetAccount,
      connect,
      disconnect,
      library,
    }),
    [
      active,
      loading,
      error,
      account,
      sweetAccount,
      connect,
      disconnect,
      library,
    ]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
};

const getLibrary = (provider) => {
  return new Web3(provider);
};

export const Web3Provider = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3OWW>{children}</Web3OWW>
    </Web3ReactProvider>
  );
};

export const useWeb3 = () => {
  return useContext(context);
};

export const CHAINS = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  1337: "localhost",
};
