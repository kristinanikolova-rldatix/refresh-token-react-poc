import React, { useEffect, useState } from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect, } from 'react-router-dom';
import { CircularProgress, CssBaseline, Grid } from '@material-ui/core';

declare global {
  interface Window {
      ENV: Record<string, string>;
  }
}

window.ENV = window.ENV || {};

const Login: React.FC = () => {
  const [authorised, setAuthorised] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const checkAuthentication = async () => {
      debugger;
      if (!isAuthenticated) {
        loginWithRedirect({
          appState: {
            GDPR_url: `${window.ENV.BASE_URL}`,
          },
        });

        return;
      }
      setAuthorised(true);
      setIsVerified(true);
    };

    if (!isLoading) {
      checkAuthentication();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (authorised) {
    debugger;
    if (isVerified) {
      return <Redirect to="/Home" />;
    } else {
      return <Redirect to='/Login' />;
    }
  }

  return (
    <div>
      <CssBaseline />
      <Grid>
        <CircularProgress />
      </Grid>
    </div>
  );
};

export default Login;