import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import theme from "./theme";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { OWWProvider } from "./hooks/useOwnedWords";
import { Web3Provider } from "./hooks/useWeb3";
import { IPFSProvider } from "./hooks/useIPFS";
import { AuthProvider } from "./hooks/useAuth";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Web3Provider>
          <AuthProvider>
            <IPFSProvider>
              <OWWProvider>
                <ColorModeScript
                  initialColorMode={theme.config.initialColorMode}
                />

                <App />
              </OWWProvider>
            </IPFSProvider>
          </AuthProvider>
        </Web3Provider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
