import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";

import styled from "@emotion/styled";
import { useWeb3 } from "../hooks/useWeb3";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

export default function Identicon() {
  const ref = useRef();
  const { account } = useWeb3();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledIdenticon ref={ref} />;
}
