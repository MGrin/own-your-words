import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";

import theme from "./theme";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const dappsConfig = {};
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <DAppProvider config={dappsConfig}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 0x01583D152E3225519D211B1F576d959F70ef9630
