// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { accountsInfo$ } from '@susy-js/light.js';
import { compose, mapPropsStream } from 'recompose';
import keyBy from 'lodash/keyBy';
import light from '@susy-js/light.js-react';
import { map, switchMap } from 'rxjs/operators';

import localForage$ from './localForage';

import { SIGNER_ACCOUNTS_LS_KEY } from '../stores/createAccountStore';

/**
 * HOC which injects the node's accounts as well as the Susy Signer accounts,
 * the latter being stored in local storage.
 */
const withAccountsInfo = compose(
  light({
    accountsInfo: () => accountsInfo$()
  }),
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(({ accountsInfo: nodeAccountsInfo, ...props }) => {
      return localForage$(SIGNER_ACCOUNTS_LS_KEY).pipe(
        map(susySignerAccounts => {
          const susySignerAccountsInfo = keyBy(
            susySignerAccounts,
            'address'
          );
          Object.keys(nodeAccountsInfo).forEach(address => {
            nodeAccountsInfo[address].type = 'node';
          });
          Object.keys(susySignerAccountsInfo).forEach(address => {
            susySignerAccountsInfo[address].type = 'signer';
          });
          return {
            ...props,
            accountsInfo: { ...susySignerAccountsInfo, ...nodeAccountsInfo }
          };
        })
      );
    })
  )
);

export default withAccountsInfo;
