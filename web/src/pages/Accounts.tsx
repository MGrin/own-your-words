import { Stack } from '@chakra-ui/react'
import React from 'react'
import TwitterAccountMint from '../containers/TwitterAccountMint'

const Accounts = () => {
  // useEffect(() => {
  //   getOwnedTokenIds().then((response) => {
  //     setTokenIds(response);
  //     response.map((tokenId) => {
  //       getOWSNById(tokenId).then((token) => console.log(token));
  //     });
  //   });
  // }, [owsn]);

  return (
    <Stack>
      <TwitterAccountMint />
    </Stack>
  )
}

export default Accounts
