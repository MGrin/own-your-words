import React from 'react'
import {
  Center,
  Stack,
  Heading,
  Text,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react'

const Landing = () => {
  const isMobile = useBreakpointValue([true, false])

  return (
    <Center>
      <Stack p={12} spacing={12}>
        <Heading as="h1" size="3xl">
          Own your words.
        </Heading>
        <Text boxShadow="lg" fontWeight="semibold">
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
  )
}

export default Landing
