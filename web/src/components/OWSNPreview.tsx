import { Box, Text, Skeleton, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getApiUrl } from '../utils'

export type OWSNMetadata = {
  name: string
  description: string
  external_url: string
  image: string
}

type OWSNPreviewProps = {
  tokenId: number
}

const OWSNPreview = ({ tokenId }: OWSNPreviewProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [metadata, setMetadata] = useState<OWSNMetadata>()

  useEffect(() => {
    fetch(`${getApiUrl()}/OWSN/${tokenId}`)
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [tokenId])

  if (loading) {
    return (
      <Skeleton
        width={180}
        height={200}
        border="1px solid"
        borderRadius="base"
      />
    )
  }

  return (
    <a href={metadata?.external_url} target="_blank" rel="noreferrer">
      <Box width={200} border="1px solid" borderRadius="base">
        {error ? (
          <Text color="tomato">{error.message}</Text>
        ) : (
          <Image borderRadius="base" src={metadata?.image} />
        )}
      </Box>
    </a>
  )
}

export default OWSNPreview
