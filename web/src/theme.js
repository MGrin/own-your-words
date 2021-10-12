import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import "@fontsource/raleway/400.css";
import "@fontsource/open-sans/700.css";
import "./index.css";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const fonts = {
  heading: "Open Sans",
  body: "Raleway",
};

const components = {
  Steps,
};

// 3. extend the theme
const theme = extendTheme({ config, fonts, components });
export default theme;
