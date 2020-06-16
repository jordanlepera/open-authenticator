import React, { useState, useEffect } from 'react';
import Layout from 'Components/layout/layout';
import AuthenticatorItem from 'Components/authenticator/AuthenticatorItem';
import { uniqueId } from 'lodash';
import { readConfigRequest, readConfigResponse, useConfigInMainRequest, deleteConfigRequest, deleteConfigResponse } from 'secure-electron-store';
import Authenticator from 'Models/Authenticator.model';

const Main = () => {
  const [authenticators, setAuthenticators] = useState(undefined);

  let list = authenticators ? authenticators.map(elem => {
    return (
      <AuthenticatorItem
        key={uniqueId('authenticator-')}
        authenticator={new Authenticator(
          elem.id,
          elem.name,
          elem.key,
          elem.account,
          elem.timeBased
        )}
        authenticators={authenticators}
        setAuthenticators={setAuthenticators} />
    );
  }) : 'N/A';

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
      {list}
    </Layout>
  );
};

export default Main;