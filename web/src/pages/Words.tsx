import { PlusSquareIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Stack, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OWWPreview from '../components/OWWPreview'
import OWWMintModal from '../containers/OWWMintModal'
import { getTokenIds } from '../redux/actions/oww'
import { owwSelector } from '../redux/selectors/oww'

const Words = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTokenIds())
  }, [dispatch])

  const {
    isOpen: isMintingModalOpen,
    onOpen: onMintingModalOpen,
    onClose: onMintingModalClose,
  } = useDisclosure()

  const { tokenIds } = useSelector(owwSelector)

  console.log(tokenIds)
  return (
    <Stack>
      <OWWMintModal isOpen={isMintingModalOpen} onClose={onMintingModalClose} />
      <Button
        colorScheme="teal"
        leftIcon={<PlusSquareIcon />}
        maxW="xs"
        onClick={onMintingModalOpen}
      >
        Mint OWW NFT
      </Button>
      <Flex wrap="wrap" pt={12}>
        {tokenIds.map((tokenId) => (
          <Box m={4} key={tokenId}>
            <OWWPreview tokenId={tokenId} />
          </Box>
        ))}
      </Flex>
    </Stack>
  )
}

export default Words
