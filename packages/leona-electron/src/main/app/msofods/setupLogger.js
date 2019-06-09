// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import susyElectron from '@susy-js/electron';

import Pino from '../utils/pino';

function setupLogger () {
  // Set options for @susy-js/electron
  susyElectron({
    logger: namespace => log => Pino({ name: namespace }).info(log)
  });
}

export default setupLogger;
