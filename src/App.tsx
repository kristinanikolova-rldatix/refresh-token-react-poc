import React from "react";
import "./App.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import { Box } from "@material-ui/core";
import Home from "./Home";

declare global {
  interface Window {
    ENV: Record<string, string>;
  }
}

window.ENV = window.ENV || {};

const App: React.FC = () => (
  <Auth0Provider
    domain={`${window.ENV.DOMAIN}`}
    clientId={`${window.ENV.CLIENT_ID}`}
    authorizationParams={{
      audience: `${window.ENV.AUDIENCE}`,
      scope: `${window.ENV.SCOPES}`,
      redirect_uri: `${window.ENV.REDIRECT_URI}`,
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <BrowserRouter>
      <Box>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
        </Switch>
      </Box>
    </BrowserRouter>
  </Auth0Provider>
);

export default App;
