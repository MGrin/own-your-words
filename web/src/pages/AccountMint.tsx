import { Text, Box, Divider, Heading, Stack } from '@chakra-ui/react'
import React from 'react'
import TwitterAccountMint from '../containers/TwitterAccountMint'

const AccountMint = () => {
  return (
    <Stack>
      <Heading>
        Store your ownership of a social account on ETH blockchain
      </Heading>
      <Divider mb={24} />
      <Text>1. Chose a social network from the list below</Text>
      <Text>
        2. Before doing any minting, the system will check the availability of
        your account.
        <br />
        It's free of charge and is required to save you money in case you
        already proved your account on the blockchain.
        <br />
        You'll be asked to authenticated in selected social network to get all
        required data for the availability check.
        <br />
        NOTE: WE DO NOT STORE ANY OF YOUR DATA ANYWHERE!
      </Text>
      <Text>
        3. If your account is available, you'll be able to start minting.
        <br />
        In order to do that, you'll be required to authorize in your social
        network for the second time.
        <br />
        This will run a bunch of smart contract calls, and you'll receive our
        OWSN NFT.
        <br />
        NOTE: It might take up to a minute for the minting process to complete.
        You can refresh your page and do whatever you want during this process.
      </Text>
      <Box h={6} />
      <Heading size="sm">Why this is not free?</Heading>
      <Text>
        In order to verify the ownership of the Social network account, we use
        so called oracles on the ETH blockchain.
        <br />
        Price of this NFT is here to cover the gas fees related to these calls
      </Text>
      <Box mb={12} />
      <TwitterAccountMint />
    </Stack>
  )
}

export default AccountMint
