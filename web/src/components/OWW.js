import {
  Divider,
  Heading,
  VStack,
  Skeleton,
  Flex,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getGatewayURL } from "../ipfs";

const OWW = ({ tokenId, metadataURI, postURL }) => {
  const [metadata, setMetadata] = useState();
  const [, setError] = useState();
  const [loaded, setLoaded] = useState(false);

  const svgSrc = useMemo(() => {
    if (!metadata) {
      return;
    }
    const src = getGatewayURL(metadata.image);
    return src;
  }, [metadata]);

  const handleOnLoad = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);
  const handleOnError = useCallback(
    (err) => {
      setError(err);
    },
    [setError]
  );

  useEffect(() => {
    fetch(getGatewayURL(metadataURI))
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  }, [metadataURI, tokenId]);

  return (
    <VStack paddingBottom="6">
      <Heading>#{tokenId}</Heading>
      {metadata && (
        <Heading size={["xs", "md"]} isTruncated width="100%">
          {metadata.name}
        </Heading>
      )}
      <Divider />
      {metadata ? (
        <>
          <embed
            width={loaded ? undefined : 0}
            height={loaded ? undefined : 0}
            onLoad={handleOnLoad}
            onError={handleOnError}
            style={{
              backgroundColor: "white",
              visibility: loaded ? "visible" : "hidden",
            }}
            type="image/svg+xml"
            src={svgSrc}
          />
          {!loaded && <Skeleton width="100%" height="400px" />}
        </>
      ) : (
        <Skeleton width="100%" height="400px" />
      )}
      {postURL && (
        <Flex>
          <Spacer />
          <Link href={postURL} isExternal>
            See original post <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
      )}
    </VStack>
  );
};

export default OWW;
