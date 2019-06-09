// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

const isEtcChainId = currentChainIdBN => currentChainIdBN.eq(61);

const chainIdToString = currentChainIdBN =>
  isEtcChainId(currentChainIdBN) ? 'ETC' : 'SOF';

const isNotSrc20TokenAddress = tokenAddress =>
  tokenAddress === 'SOF' || tokenAddress === 'ETC';

const isSrc20TokenAddress = tokenAddress =>
  !isNotSrc20TokenAddress(tokenAddress);

export {
  chainIdToString,
  isSrc20TokenAddress,
  isNotSrc20TokenAddress,
  isEtcChainId
};
