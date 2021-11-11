import React, { useEffect, useRef } from "react";
// @ts-expect-error
import Jazzicon from "@metamask/jazzicon";

import styled from "@emotion/styled";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

type IdenticonProps = {
  address: string;
};

const Identicon: React.FC<IdenticonProps> = ({ address }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);

  return <StyledIdenticon ref={ref} />;
};

export default Identicon;
