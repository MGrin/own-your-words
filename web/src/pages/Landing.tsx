import React from 'react'
import {
  Center,
  Stack,
  Heading,
  Text,
  Image,
  useBreakpointValue,
  Divider,
} from '@chakra-ui/react'
import FeatureCta from '../components/FeatureCta'

const Landing = () => {
  const isMobile = useBreakpointValue([true, false])

  return (
    <>
      <Center>
        <Stack p={12} spacing={12}>
          <Heading as="h1" size="3xl">
            Own your words.
          </Heading>
          <Text fontWeight="semibold">
            Store your social media posts on a blockchain. <br /> Own them as
            NFTs.
          </Text>
        </Stack>
        <Image
          hidden={isMobile}
          src={`${process.env.PUBLIC_URL}/logo.white.jpg`}
          borderRadius="base"
        />
      </Center>
      <Divider mb={12} />
      <Stack spacing={4}>
        <FeatureCta
          title="1. Store your ownership of a social account on ETH blockchain"
          imageUrl={`${process.env.PUBLIC_URL}/logo.jpg`}
          imageLocation="left"
        >
          <Text>
            Prove that you own a social media account and receive an NFT.
            <br />
            You'll need this NFT for the next steps.
          </Text>
        </FeatureCta>

        <FeatureCta
          title="2. Select one of your posts and receive them as OwnYourWords NFT"
          imageUrl={`${process.env.PUBLIC_URL}/logo.jpg`}
          imageLocation="right"
        >
          <Text>
            You'll be able to resell these NFTs, or use them for the next step
          </Text>
        </FeatureCta>

        <FeatureCta
          title="3. Create an NFT book constructed from your social medai content"
          imageUrl={`${process.env.PUBLIC_URL}/logo.jpg`}
          imageLocation="left"
        >
          <Text>
            A unique way of leaving a trace on the blockchain of your thoughts
            and visions!
          </Text>
        </FeatureCta>
      </Stack>
    </>
  )
}

export default Landing
