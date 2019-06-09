// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function onWindowClose (leonaApp) {
  const { processSaveWinPosition, windowClear } = leonaApp;

  processSaveWinPosition(leonaApp);
  windowClear(leonaApp);
}

export default onWindowClose;
