// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { chainName$ } from '@susy-js/light.js';
import { compose, mapPropsStream, withHandlers, withProps } from 'recompose';
import light from '@susy-js/light.js-react';
import localForage from 'localforage';
import { map, switchMap } from 'rxjs/operators';

import sophonIcon from '../assets/img/tokens/sophon.png';
import classicIcon from '../assets/img/tokens/classic.svg';
import localForage$ from './localForage';
import LS_PREFIX from '../stores/utils/lsPrefix';
import withAccount from './withAccount';
import { isSrc20TokenAddress } from './chain';

const LS_KEY = `${LS_PREFIX}::tokens`;

const DEFAULT_ETC_TOKENS = {
  ETC: {
    address: 'ETC',
    decimals: 18,
    logo: classicIcon,
    name: 'Sophy',
    symbol: 'ETC'
  }
};

const DEFAULT_SOF_TOKENS = {
  SOF: {
    address: 'SOF',
    decimals: 18,
    logo: sophonIcon,
    name: 'Sophy',
    symbol: 'SOF'
  }
};

// We have one key per chain per account, in this format:
// __susylight::tokens::0x123::kovan
const getLsKey = ({ account: { address }, chainName }) =>
  `${LS_KEY}::${address}::${chainName}`;

/**
 * HOC which injects the user's whitelisted tokens (stored in localStorage).
 */
const withTokens = compose(
  // Inject chainName and accountAddress into props
  light({
    chainName: () => chainName$()
  }),
  withAccount,
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(props =>
      localForage$(getLsKey(props)).pipe(
        map(tokens => ({
          ...props,
          tokens:
            tokens ||
            (props.chainName === 'classic'
              ? DEFAULT_ETC_TOKENS
              : DEFAULT_SOF_TOKENS)
        }))
      )
    )
  ),
  // Also compute some related props related to tokens
  withProps(({ tokens }) => {
    const tokensArray = Object.values(tokens);

    return {
      tokensArray,
      tokensArrayWithoutSof: tokensArray.filter(
        // Sophon and Sophon Classic are the only tokens without address, has 'SOF' or 'ETC' instead
        ({ address }) => isSrc20TokenAddress(address)
      )
    };
  }),
  // Add handlers to add/remove tokens
  withHandlers({
    addToken: props => (address, token) => {
      const newTokens = { ...props.tokens, [address]: token };
      return localForage.setItem(getLsKey(props), newTokens);
    },
    removeToken: props => address => {
      const { [address]: _, ...newTokens } = props.tokens;
      return localForage.setItem(getLsKey(props), newTokens);
    }
  })
);

export default withTokens;
