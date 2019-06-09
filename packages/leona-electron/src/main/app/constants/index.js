// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { IS_PACKAGED } from '../utils/paths';

const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Security. Additional network security is configured after `cli` is available:
 * in leona-electron/src/main/app/options/config/index.js
 *
 * Note: 127.0.0.1 is a trusted loopback and more trustworthy than localhost.
 * See https://letsencrypt.org/docs/certificates-for-localhost/
 */
const DEFAULT_CHAIN = 'foundation';
const DEFAULT_WS_PORT = '8546';
const TRUSTED_LOOPBACK = '127.0.0.1';

export {
  DEFAULT_CHAIN,
  DEFAULT_WS_PORT,
  IS_PACKAGED,
  IS_PROD,
  TRUSTED_LOOPBACK
};
