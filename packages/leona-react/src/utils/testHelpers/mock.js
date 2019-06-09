// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';
import { toWei } from '@susy-js/api/lib/util/wei';

const SECRET_PHRASE = 'foo';
const ADDRESS_FROM = '0x456';
const ADDRESS_TO = '0x123';
const GAS_PRICE = 4; // in Gwei
const GAS_ESTIMATE = 456;
const GAS_ESTIMATE_CONTRACT_TX = 123;
const AMOUNT = 0.01;

export const api = {
  sof: {
    estimateGas: jest.fn(() => Promise.resolve(new BigNumber(GAS_ESTIMATE)))
  },
  susy: {
    generateSecretPhrase: jest.fn(() => Promise.resolve(SECRET_PHRASE)),
    newAccountFromPhrase: jest.fn(() => Promise.resolve()),
    phraseToAddress: jest.fn(() => Promise.resolve(ADDRESS_TO)),
    setAccountName: jest.fn(() => Promise.resolve()),
    setAccountMeta: jest.fn(() => Promise.resolve())
  },
  signer: {
    confirmRequest: jest.fn(() => Promise.resolve(true))
  }
};

export const src20 = {
  address: 'THIBCoin',
  decimals: 18
};

export const sof = {
  address: 'SOF'
};

export const etc = {
  address: 'ETC'
};

export const makeContract = {
  contractObject: {
    instance: {
      transfer: {
        estimateGas: () =>
          Promise.resolve(new BigNumber(GAS_ESTIMATE_CONTRACT_TX))
      }
    }
  },
  transfer$: jest.fn(() => ({ subscribe: jest.fn() }))
};

export const post$ = {
  subscribe: jest.fn(callback => {
    setTimeout(callback({ estimating: true }), 100); // eslint-disable-line standard/no-callback-literal
    setTimeout(callback({ requested: 1 }), 200); // eslint-disable-line standard/no-callback-literal
  })
};

export const txSof = {
  amount: AMOUNT, // In Sophy
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: sof
};

export const txEtc = {
  amount: AMOUNT, // In Sophy
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: etc
};

const txSrc20Base = {
  amount: AMOUNT, // In token
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: src20
};

export const txSrc20 = {
  ...txSrc20Base,
  args: [
    txSrc20Base.to,
    new BigNumber(txSrc20Base.amount).multipliedBy(
      new BigNumber(10).pow(txSrc20Base.token.decimals)
    )
  ],
  options: {
    from: txSrc20Base.from,
    gasPrice: toWei(txSrc20Base.gasPrice, 'shannon') // shannon == gwei
  }
};
