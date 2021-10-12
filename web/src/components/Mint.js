import {
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { File } from "nft.storage";

import OWWPreview, { generateSVG } from "./OWWPreview";
import { useNFTStorage, useOWW } from "../hooks/useOwnedWords";

const mint = async (oww, account, contract, nftStorageClient) => {
  const metadata = await nftStorageClient.store({
    name: `OWW ${oww.sn_name}:${oww.author_name}:${oww.post_id}`,
    description: "Own Your Words - your social media content on a blockchain.",
    image: new File(
      [generateSVG(oww)],
      `OWW ${oww.sn_name}:${oww.author_name}:${oww.post_id}.svg`,
      { type: "image/svg+xml" }
    ),
  });

  const args = [
    oww.sn_name,
    oww.author_id,
    oww.author_name,
    oww.author_picture_url,
    oww.post_id,
    oww.post_url,
    oww.message,
    metadata.url,
  ];
  const receipt = await contract.methods.mint(...args).send({ from: account });
  const event = receipt.events.Transfer;
  if (!event) {
    throw new Error("Something went wrong.");
  }

  const tokenId = event.returnValues.tokenId;
  return tokenId;
};

const Mint = ({ oww, onSuccess, onFailure }) => {
  const { account } = useEthers();
  const contract = useOWW();
  const nftStorageClient = useNFTStorage();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [existingTokenId, setExistingTokenId] = useState();

  useEffect(() => {
    if (!oww) {
      return;
    }

    setLoading(true);

    contract.methods
      .getTokenIdForPost(oww.sn_name, oww.author_id, oww.post_id)
      .call({ from: account })
      .then((tokenId) => {
        setExistingTokenId(tokenId);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [oww, account, contract]);

  const handleMintClick = useCallback(() => {
    if (!account || !contract || !nftStorageClient) {
      return;
    }

    setLoading(true);

    mint(oww, account, contract, nftStorageClient)
      .then((tokenId) => {
        setLoading(false);
        onSuccess(tokenId);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        console.error(err);
      });
  }, [oww, account, contract, nftStorageClient, onSuccess]);

  const canMint = !error && !existingTokenId;

  return (
    <VStack width="100%">
      {!error ? (
        <OWWPreview oww={oww} existingTokenId={existingTokenId} />
      ) : (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error occured!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            This probably means that the NFT is already minted by someone else.
          </AlertDescription>
        </Alert>
      )}

      {canMint ? (
        <Button
          isLoading={loading}
          loadingText="Minting"
          disabled={!!error || loading}
          onClick={handleMintClick}
          size="lg"
          colorScheme="green"
        >
          MINT
        </Button>
      ) : (
        <Button onClick={onFailure} size="lg" colorScheme="green">
          Try another one!
        </Button>
      )}
    </VStack>
  );
};

export default Mint;
