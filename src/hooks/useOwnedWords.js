import { createContext, useContext, useEffect, useMemo, useState } from "react";
import owwAbi from "../oww.json";
import owsnAbi from "../owsn.json";
import { useWeb3 } from "./useWeb3";

const context = createContext();

export const OWWProvider = ({ children }) => {
  const { eth } = useWeb3();
  const [oww, setOWW] = useState();
  const [owsn, setOWSN] = useState();
  const account = null;

  useEffect(() => {
    if (!owwAbi.abi || !owsnAbi.abi) {
      return;
    }

    const owwContract = new eth.Contract(
      owwAbi.abi,
      process.env.REACT_APP_OWW_CONTRACT
    );
    const owsnContract = new eth.Contract(
      owsnAbi.abi,
      process.env.REACT_APP_OWSN_CONTRACT
    );

    setOWW(owwContract);
    setOWSN(owsnContract);

    owwContract.methods
      .getVersion()
      .call({ sender: account })
      .then((version) => {
        window.OWW_CONTRACT_VERSION = version;
        console.log(`OWW version: ${version}`);
      })
      .catch((err) => {
        console.warning(`Failed to get the OWW contract version: `, err);
      });

    owsnContract.methods
      .getVersion()
      .call({ sender: account })
      .then((version) => {
        window.OWSN_CONTRACT_VERSION = version;
        console.log(`OWSN version: ${version}`);
      })
      .catch((err) => {
        console.warning(`Failed to get the OWSN contract version: `, err);
      });
  }, [eth]);

  const value = useMemo(
    () => ({
      oww,
      owsn,
    }),
    [oww, owsn]
  );
  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useOWW = () => {
  const value = useContext(context);
  return value ? value.oww : undefined;
};

export const useOWSN = () => {
  const value = useContext(context);
  return value ? value.owsn : undefined;
};
