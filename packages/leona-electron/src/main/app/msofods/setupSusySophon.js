// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import SusySophon from '../susySophon';

function setupSusySophon (leonaApp) {
  // Run Susy Sophon if not running and requested
  return new SusySophon(leonaApp.win);
}

export default setupSusySophon;
