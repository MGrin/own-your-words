import React, { useCallback } from 'react'

import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Code,
  Input,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { owwInputSelector, owwSelector } from '../redux/selectors/oww'
import { changePostURL, clearInput, mintPost } from '../redux/actions/oww'
import { formatError } from '../utils'

const SUPPORTED_NETWORKS = ['Twitter']

const getSnName = (urlStr: string) => {
  const url = new URL(urlStr)
  switch (url.host) {
    case 'twitter.com': {
      return 'twitter'
    }
    default: {
      return undefined
    }
  }
}

type OWWMintModalProps = {
  isOpen: boolean
  onClose: () => void
}
const OWWMintModal = ({ isOpen, onClose }: OWWMintModalProps) => {
  const { postUrl, isUrlValid, postId } = useSelector(owwInputSelector)
  const { loading, error } = useSelector(owwSelector)

  const dispatch = useDispatch()

  const onModalClose = useCallback(() => {
    dispatch(clearInput())
    onClose()
  }, [dispatch, onClose])

  const onPostUrlChange = useCallback(
    ({ target: { value } }) => {
      dispatch(changePostURL({ postUrl: value }))
    },
    [dispatch]
  )

  const onMintOWWClick = useCallback(() => {
    if (!postUrl || !postId) {
      return
    }

    const snName = getSnName(postUrl)
    if (!snName) {
      return
    }

    dispatch(mintPost({ snName, postId }))
  }, [dispatch, postUrl, postId])

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint OwnYourWords NFT</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2}>
            <Text>
              Paste here a link to the post you'd like to mint as NFT.
            </Text>
            <Text>NOTE: Currently supported social networks:</Text>
            <Code padding={2}> {SUPPORTED_NETWORKS.join(', ')}</Code>
            <Input
              placeholder="Post link"
              value={postUrl}
              onChange={onPostUrlChange}
            />
            {!isUrlValid && postUrl && (
              <Text>
                URL is not valid, or the social network is not supported
              </Text>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          {error && <Text color="tomato">{formatError(error)}</Text>}
          <Button variant="ghost" mr={3} onClick={onModalClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={onMintOWWClick}
            isLoading={loading}
            disabled={loading || !isUrlValid}
          >
            Mint
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default OWWMintModal
