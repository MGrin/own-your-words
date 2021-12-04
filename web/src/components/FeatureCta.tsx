import { Flex, Heading, Image, Stack } from '@chakra-ui/react'
import React from 'react'

type FeatureProps = {
  title: string
  imageUrl: string
  imageLocation: 'left' | 'right'
}

const LandingCta: React.FC<FeatureProps> = ({
  title,
  imageUrl,
  imageLocation,
  children,
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      direction={imageLocation === 'left' ? 'row' : 'row-reverse'}
    >
      <Image src={imageUrl} alt={imageUrl} />
      <Stack>
        <Heading size="md">{title}</Heading>
        {children}
      </Stack>
    </Flex>
  )
}

export default LandingCta
