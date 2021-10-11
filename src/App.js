import { Box, Container } from "@chakra-ui/react";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "./containers/Header";
import Accounts from "./pages/Accounts";
import Landing from "./pages/Landing";
import Statements from "./pages/Statements";
import Words from "./pages/Words";

const App = () => {
  return (
    <Box p="6">
      <Header />
      <Container>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/accounts" exact component={Accounts} />
          <Route path="/words" exact component={Words} />
          <Route path="/statements" exact component={Statements} />
          <Route path="/" component={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    </Box>
  );
};

export default App;
