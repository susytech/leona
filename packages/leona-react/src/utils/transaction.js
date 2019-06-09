// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@susy-js/contracts/lib/abi/sip20';
import Abi from '@susy-js/abi';
import Token from '@susy-js/abi/lib/token';
import { sip20 } from '@susy-js/contracts/lib/abi';
import BigNumber from 'bignumber.js';
import { makeContract } from '@susy-js/light.js';
import memoize from 'lodash/memoize';
import { toWei } from '@susy-js/api/lib/util/wei';

import { isNotSrc20TokenAddress } from './chain';
import Debug from './debug';
import SophonTx from 'sophonjs-tx';

const debug = Debug('transaction');
const GAS_MULT_FACTOR = 1.25; // Since estimateGas is not always accurate, we add a 25% factor for buffer.

export const contractForToken = memoize(tokenAddress =>
  makeContract(tokenAddress, abi)
);

/**
 * Estimate the amount of gas for our transaction.
 */
export const estimateGas = (tx, token, api) => {
  if (!tx || !Object.keys(tx).length) {
    return Promise.reject(new Error('Tx not set.'));
  }

  if (isNotSrc20TokenAddress(token.address)) {
    return estimateGasForSof(txForSof(tx), api).then(estimatedGasForSof => {
      // do not add any buffer in case of an account to account transaction
      return estimatedGasForSof.eq(21000)
        ? estimatedGasForSof
        : addBuffer(estimatedGasForSof);
    });
  } else {
    return estimateGasForSrc20(txForSrc20(tx, token), token).then(addBuffer);
  }
};

/**
 * Estimate gas to transfer in SRC20 contract. Expensive function, so we
 * memoize it.
 */
const estimateGasForSrc20 = memoize((txForSrc20, token) => {
  debug(`Estimating gas for tx on token contract.`, token, txForSrc20);
  return contractForToken(
    token.address
  ).contractObject.instance.transfer.estimateGas(
    txForSrc20.options,
    txForSrc20.args
  );
}, JSON.stringify);

/**
 * Estimate gas to transfer to an SOF or ETC address. Expensive function, so we
 * memoize it. Note that you must only transfer from and SOF to an SOF address,
 * or from an ETC to an ETC address.
 */
const estimateGasForSof = memoize((txForSof, api) => {
  debug(`Estimating gas for tx.`, txForSof);
  return api.sof.estimateGas(txForSof);
}, JSON.stringify);

/**
 * Add some extra gas buffer just to be sure user has enough balance.
 *
 * @param {BigNumber} estimated - The estimated gas price returned by
 * estimateGas.
 */
const addBuffer = estimated => {
  // Add a buffer to the estimated gas, and round the number
  const withBuffer = estimated.multipliedBy(GAS_MULT_FACTOR).decimalPlaces(0);
  debug(`Estimated gas ${+estimated}, with buffer ${+withBuffer}.`);
  return withBuffer;
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to makeContract.transfer(...).
 */
export const txForSrc20 = (tx, token) => {
  const output = {
    args: [
      tx.to,
      new BigNumber(tx.amount).multipliedBy(
        new BigNumber(10).pow(token.decimals)
      )
    ],
    options: {
      from: tx.from,
      gasPrice: toWei(tx.gasPrice, 'shannon') // shannon == gwei
    }
  };

  if (tx.gas) {
    output.options.gas = tx.gas;
  }

  return output;
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to post$(tx).
 */
export const txForSof = tx => {
  const output = {
    from: tx.from,
    gasPrice: toWei(tx.gasPrice, 'shannon'), // shannon == gwei
    to: tx.to,
    value: toWei(tx.amount.toString())
  };
  // gas field should not be present when the function is called for gas estimation.
  if (tx.gas) {
    output.gas = tx.gas;
  }
  return output;
};

/**
 * This.tx is a user-friendly tx object. This function converts it to an
 * SophonTx object.
 */
const getSophonTx = tx => {
  const { amount, chainId, gas, gasPrice, to, token, transactionCount } = tx;

  const txParams = {
    nonce: '0x' + transactionCount.toNumber().toString(16),
    gasLimit: '0x' + gas.toNumber().toString(16),
    gasPrice: toWei(gasPrice, 'shannon').toNumber(),
    chainId
  };

  if (isNotSrc20TokenAddress(token.address)) {
    txParams.to = to;
    txParams.value = parseFloat(amount) * Math.pow(10, 18);
  } else {
    txParams.to = token.address;
    txParams.data =
      '0x' +
      new Abi(sip20).functions
        .find(f => f._name === 'transfer')
        .encodeCall([
          new Token('address', to),
          new Token(
            'uint',
            '0x' +
              new BigNumber(amount)
                .multipliedBy(new BigNumber(10).pow(token.decimals))
                .toNumber()
                .toString(16)
          )
        ]);
  }

  return new SophonTx(txParams);
};

/*
 * Sign the given this.tx with the given signature.
 *
 * sophonjs-tx does not support SIP155-compliant signatures (https://git.io/fh3SG)
 * This is a workaround from https://git.io/fh3S8
 */
export const signTransactionWithSignature = (thisTx, signature) => {
  const tx = getSophonTx(thisTx);

  const sigBuf = Buffer.from(signature.substr(2), 'hex');

  // Mimicking the way tx.sign() works
  let v = sigBuf[64] + 27;

  if (tx._chainId > 0) {
    v += tx._chainId * 2 + 8;
  }

  tx.r = sigBuf.slice(0, 32);
  tx.s = sigBuf.slice(32, 64);
  tx.v = Buffer.from([v]);

  return tx.serialize();
};

/*
 * Return the SSSRLP of the given this.tx.
 *
 * From https://git.io/fh3Sd
 */
export const transactionToRlp = thisTx => {
  const tx = getSophonTx(thisTx);

  const { v, r, s } = tx;

  // Poor man's serialize without signature.
  tx.v = Buffer.from([tx._chainId]);
  tx.r = Buffer.from([0]);
  tx.s = Buffer.from([0]);

  const srlp = '0x' + tx.serialize().toString('hex');

  // Restore previous values
  tx.v = v;
  tx.r = r;
  tx.s = s;

  return srlp;
};
