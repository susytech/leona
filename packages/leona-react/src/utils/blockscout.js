// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import i18n, { packageNS } from '../i18n';
import { isNotSrc20TokenAddress } from './chain';

const baseUrlForChain = chainName => {
  let baseUrl;

  let chainNameBlockscout = '';

  switch (chainName) {
    case 'foundation':
      chainNameBlockscout = 'mainnet';
      baseUrl = `https://blockscout.com/sof/${chainNameBlockscout}`;
      break;
    case 'classic':
      chainNameBlockscout = 'mainnet';
      baseUrl = `https://blockscout.com/etc/${chainNameBlockscout}`;
      break;
    case 'kovan':
    case 'ropsten':
      chainNameBlockscout = chainName;
      baseUrl = `https://blockscout.com/sof/${chainNameBlockscout}`;
      break;
    default:
      console.error(i18n.t(`${packageNS}:utils.blockscout_chain`));
  }

  return baseUrl;
};

// Tx URL
const sofTxUrl = (chainName, hash) =>
  `${baseUrlForChain(chainName)}/tx/${hash}/internal_transactions`;

const tokenTxUrl = (chainName, hash) =>
  `${baseUrlForChain(chainName)}/tx/${hash}/token_transfers`;

const blockscoutTxUrl = (chainName, hash, tokenAddress) =>
  isNotSrc20TokenAddress(tokenAddress)
    ? sofTxUrl(chainName, hash)
    : tokenTxUrl(chainName, hash);

export { blockscoutTxUrl };
