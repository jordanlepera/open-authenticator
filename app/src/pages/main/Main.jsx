import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Layout from 'Components/layout/layout';
import AuthenticatorItem from 'Components/authenticator/AuthenticatorItem';
import { uniqueId } from 'lodash';
import { readConfigRequest, readConfigResponse, useConfigInMainRequest, deleteConfigRequest, deleteConfigResponse } from 'secure-electron-store';
import Authenticator from 'Models/Authenticator.model';
import placeholderLight from 'Resources/artwork-1-light.svg';

const EmptyPlaceholderContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center'
});

const EmptyPlaceholderImg = styled('img')({
  width: 290,
  height: 290,
  margin: 30,
  WebkitUserSelect: 'none'
});

const EmptyPlaceholderTxt = styled('div')({
  whiteSpace: 'pre-line',
  color: '#3D3D3D',
  fontWeight: 500,
  fontSize: '1.5em',
  maxWidth: 300,
  WebkitUserSelect: 'none'
});

const Main = () => {
  const [authenticators, setAuthenticators] = useState(undefined);

  const EmptyPlaceholder = () => {
    return (
      <EmptyPlaceholderContainer >
        <EmptyPlaceholderImg src={placeholderLight} alt="placeholder no authenticator" />
        <EmptyPlaceholderTxt>
          Pour ajouter un générateur de code, cliquez sur le bouton "+" en haut à droite
        </EmptyPlaceholderTxt>
      </EmptyPlaceholderContainer>
    );
  };

  let list = authenticators && authenticators.length !== 0 ? authenticators.map(elem => {
    return (
      <AuthenticatorItem
        key={uniqueId('authItem-')}
        authenticator={new Authenticator(
          elem.id,
          elem.name,
          elem.key,
          elem.account,
          elem.timeBased
        )}
        authenticators={authenticators}
        setAuthenticators={setAuthenticators}
      />
    );
  }) : '';

  useEffect(() => {
    window.api.store.clearRendererBindings();
    // Request so that the main process can use the store
    window.api.store.send(useConfigInMainRequest);
    window.api.store.onReceive(readConfigResponse, function (args) {
      if (args.success) {
        if (authenticators === undefined) {
          setAuthenticators(args.value);
        }
      }
    });
    window.api.store.send(readConfigRequest, 'authenticators');
  }, []);

  return (
    <Layout authenticators={authenticators} setAuthenticators={setAuthenticators}>
      {authenticators && authenticators.length !== 0 ? list : <EmptyPlaceholder />}
    </Layout>
  );
};

export default Main;