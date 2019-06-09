// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import abi from '@susy-js/contracts/lib/abi/sip20';
import BigNumber from 'bignumber.js';
import lightJs from '@susy-js/light.js';

import { estimateGas, contractForToken } from './transaction';
import * as mock from './testHelpers/mock';

jest.mock('@susy-js/light.js', () => ({
  makeContract: jest.fn(() => mock.makeContract)
}));

describe('contractForToken', () => {
  test('should call makeContract', () => {
    contractForToken('foo');
    expect(lightJs.makeContract).toHaveBeenCalledWith('foo', abi);
  });

  test('should be memoized', () => {
    const a = contractForToken('foo');
    const b = contractForToken('foo');
    expect(a).toBe(b);
  });
});

describe('estimateGas', () => {
  test('should throw error if no tx is set', () => {
    expect(estimateGas(null)).rejects.toHaveProperty('message', 'Tx not set.');
  });

  test('should throw error if tx is empty', () => {
    expect(estimateGas({})).rejects.toHaveProperty('message', 'Tx not set.');
  });

  test('should call estimateGasForSrc20 with token', () => {
    expect(estimateGas(mock.txSrc20, mock.src20, mock.api)).resolves.toEqual(
      new BigNumber(154)
    );
  });

  test('should call estimateGasForSof with token', () => {
    expect(estimateGas(mock.txSof, mock.sof, mock.api)).resolves.toEqual(
      new BigNumber(570)
    );
  });
});
