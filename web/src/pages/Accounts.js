import { Stack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import TwitterAccountMint from "../containers/TwitterAccountMint";
import { useOWSN } from "../hooks/useOwnedWords";

const Accounts = () => {
  const { owsn, getOwnedTokenIds, getOWSNById } = useOWSN();
  const [tokenIds, setTokenIds] = useState([]);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!owsn) {
      return;
    }

    getOwnedTokenIds().then((response) => {
      setTokenIds(response);
      response.map((tokenId) => {
        getOWSNById(tokenId).then((token) => console.log(token));
      });
    });
  }, [owsn]);

  return (
    <Stack>
      <TwitterAccountMint />
    </Stack>
  );
};

export default Accounts;
