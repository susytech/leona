// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function hideWindow (leonaApp) {
  const { processSaveWinPosition, win } = leonaApp;

  if (!win) {
    return;
  }

  processSaveWinPosition(leonaApp); // Save window position when hide, particularly necessary on Linux
  leonaApp.emit('hide-window');
  win.hide();
  leonaApp.emit('after-hide-window');
}

export default hideWindow;
