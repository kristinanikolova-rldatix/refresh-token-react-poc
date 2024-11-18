import React, { useEffect, useState } from "react";
import { Button, Typography, Box, makeStyles, Paper } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { GetTokenSilentlyVerboseResponse } from "@auth0/auth0-spa-js";

declare global {
  interface Window {
    ENV: Record<string, string>;
  }
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
  audience: string;
  oauthTokenScope: string;
  client_id: string;
  expiresAt: number;
}

window.ENV = window.ENV || {};
const AUTH_KEY_PREFIX = `@@auth0spajs@@::${window.ENV.CLIENT_ID}::${window.ENV.AUDIENCE}`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),
  },
  papersContainer: {
    display: 'flex',
    flexDirection: 'row', 
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: '100%',
    maxWidth: 1700,
    justifyContent: 'center',
  },
  tokenContainer: {
    padding: theme.spacing(3),
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  tokenText: {
    wordBreak: 'break-all',
    color: theme.palette.text.primary,
  },
  refreshButton: {
    marginTop: theme.spacing(2),
  },
}));


const Home: React.FC = () => {
  const classes = useStyles();
  const { getAccessTokenSilently } = useAuth0();
  const [initialToken, setInitialToken] = useState<string | null>(null);
  const [refreshedToken, setRefreshedToken] = useState<string | null>(null);
  const [initialTokenLocalStorage, setInitialTokenLocalStorage] = useState<TokenResponse | null>(null);
  const [refreshedTokenLocalStorage, setRefreshedTokenLocalStorage] = useState<TokenResponse | null>(null);

  const getTokenFromLocalStorage = (): TokenResponse | null => {
    const foundKey = Object.keys(localStorage).find(key => key.startsWith(AUTH_KEY_PREFIX));
    if (!foundKey) return null;

    try {
      const storedItem = localStorage.getItem(foundKey);
      if (storedItem) {
        const parsedData = JSON.parse(storedItem);
        return parsedData.body ? {
          access_token: parsedData.body.access_token,
          refresh_token: parsedData.body.refresh_token,
          scope: parsedData.body.scope,
          expires_in: parsedData.body.expires_in,
          token_type: parsedData.body.token_type,
          audience: parsedData.body.audience,
          oauthTokenScope: parsedData.body.oauthTokenScope,
          client_id: parsedData.body.client_id,
          expiresAt: parsedData.expiresAt,
        } : null;
      }
    } catch (error) {
      console.error("Error parsing token from localStorage:", error);
    }
    return null;
  };

  const fetchRefreshedAccessToken = async () => {
    try {
      const token: GetTokenSilentlyVerboseResponse = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${window.ENV.AUDIENCE}`,
          scope: `${window.ENV.SCOPES}`,
          response_type: 'token',
        },
        cacheMode: 'off',
        detailedResponse: true,
      });
      setRefreshedToken(token.access_token);
      setRefreshedTokenLocalStorage(getTokenFromLocalStorage());
    } catch (err) {
      console.error("Error fetching access token:", err);
    }
  };

  const fetchInitialAccessToken = async () => {
    try {
      const token: GetTokenSilentlyVerboseResponse = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${window.ENV.AUDIENCE}`,
          scope: `${window.ENV.SCOPES}`,
          response_type: 'token',
        },
        detailedResponse: true,
      });
      return token;
    } catch (err) {
      console.error("Error fetching access token:", err);
    }
  };
  
  useEffect(() => {
    const initializeTokens = async () => {
      const token = await fetchInitialAccessToken();
      if (token) {
        setInitialToken(token.access_token);
      }
      setInitialTokenLocalStorage(getTokenFromLocalStorage());
    };
  
    initializeTokens();
  }, []);
  

  return (
    <Box className={classes.root}>
    <Button
      variant="contained"
      color="primary"
      onClick={fetchRefreshedAccessToken}
      className={classes.refreshButton}
    >
      Refresh Token
    </Button>
  
    <Box className={classes.papersContainer}>
      <Paper className={classes.tokenContainer} elevation={3}>
        <Typography variant="h6">Initial Token from Local Storage:</Typography>
        <Typography variant="body2" className={classes.tokenText}>
          {initialTokenLocalStorage ? (
            <>
              <strong>Access Token:</strong> {initialToken} <br />
              <strong>Access Token - Local Storage:</strong> {initialTokenLocalStorage.access_token} <br />
              <strong>Refresh Token:</strong> {initialTokenLocalStorage.refresh_token} <br />
              <strong>Scope:</strong> {initialTokenLocalStorage.scope} <br />
              <strong>Expires In:</strong> {initialTokenLocalStorage.expires_in} <br />
              <strong>Token Type:</strong> {initialTokenLocalStorage.token_type} <br />
              <strong>Audience:</strong> {initialTokenLocalStorage.audience} <br />
              <strong>Oauth Token Scope:</strong> {initialTokenLocalStorage.oauthTokenScope} <br />
              <strong>Client ID:</strong> {initialTokenLocalStorage.client_id} <br />
              <strong>Expires At:</strong> {new Date(initialTokenLocalStorage.expiresAt * 1000).toLocaleString()} <br />
            </>
          ) : "No token available in local storage"}
        </Typography>
      </Paper>
  
      <Paper className={classes.tokenContainer} elevation={3}>
        <Typography variant="h6">Refreshed Token from Local Storage:</Typography>
        <Typography variant="body2" className={classes.tokenText}>
          {refreshedTokenLocalStorage ? (
            <>
              <strong>Access Token:</strong> {refreshedToken} <br />
              <strong>Access Token - Local Storage:</strong> {refreshedTokenLocalStorage.access_token} <br />
              <strong>Refresh Token:</strong> {refreshedTokenLocalStorage.refresh_token} <br />
              <strong>Scope:</strong> {refreshedTokenLocalStorage.scope} <br />
              <strong>Expires In:</strong> {refreshedTokenLocalStorage.expires_in} <br />
              <strong>Token Type:</strong> {refreshedTokenLocalStorage.token_type} <br />
              <strong>Audience:</strong> {refreshedTokenLocalStorage.audience} <br />
              <strong>Oauth Token Scope:</strong> {refreshedTokenLocalStorage.oauthTokenScope} <br />
              <strong>Client ID:</strong> {refreshedTokenLocalStorage.client_id} <br />
              <strong>Expires At:</strong> {new Date(refreshedTokenLocalStorage.expiresAt * 1000).toLocaleString()} <br />
            </>
          ) : "No refreshed token available in local storage"}
        </Typography>
      </Paper>
    </Box>
  </Box>
  
  );
};

export default Home;
