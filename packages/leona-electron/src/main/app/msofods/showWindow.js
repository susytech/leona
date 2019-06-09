// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { screen } from 'electron';

import { getSavedWindowPosition, hasSavedWindowPosition } from '../settings';

import Pino from '../utils/pino';

const pino = Pino();

function showWindow (leonaApp, trayPos) {
  const {
    calculateWinPosition,
    createWindow,
    fixWinPosition,
    moveWindowUp,
    processSaveWinPosition,
    setupWinListeners,
    setupWin32Listeners,
    win
  } = leonaApp;

  pino.info('Showing window id: ', leonaApp.win && leonaApp.win.id);

  if (!win) {
    createWindow(leonaApp);
  }

  leonaApp.emit('show-window');

  const calculatedWinPosition = calculateWinPosition(leonaApp, trayPos);

  pino.info('Calculated window position: ', calculatedWinPosition);

  const mainScreen = screen.getPrimaryDisplay();
  // const allScreens = screen.getAllDisplays();
  const mainScreenDims = mainScreen.size;
  const mainScreenWorkAreaSize = mainScreen.workAreaSize;

  // workAreaSize does not include the tray depth
  leonaApp.trayDepth = Math.max(
    mainScreenDims.width - mainScreenWorkAreaSize.width,
    mainScreenDims.height - mainScreenWorkAreaSize.height
  );

  pino.info(
    'Previously saved window position exists: ',
    hasSavedWindowPosition()
  );

  const loadedWindowPosition = hasSavedWindowPosition()
    ? getSavedWindowPosition()
    : undefined;

  pino.info('Loaded window position: ', loadedWindowPosition);

  const fixedWinPosition = fixWinPosition(leonaApp, loadedWindowPosition);

  pino.info('Fixed window position: ', fixedWinPosition);

  /**
   * Since the user may change the tray to be on any side of the screen.
   * If the user moved the window out of where the tray would be in the screen resolution bounds.
   * Restore the window so it is fully visible adjacent to where the tray would be.
   */
  const x =
    (fixedWinPosition && fixedWinPosition.x) ||
    (loadedWindowPosition && loadedWindowPosition.x) ||
    calculatedWinPosition.x;

  const y =
    (fixedWinPosition && fixedWinPosition.y) ||
    (loadedWindowPosition && loadedWindowPosition.y) ||
    calculatedWinPosition.y;

  leonaApp.win.setPosition(x, y);
  leonaApp.win.show();

  if (!leonaApp.hasSetupWinListeners) {
    setupWinListeners(leonaApp);
    setupWin32Listeners(leonaApp);

    leonaApp.hasSetupWinListeners = true;
  }

  moveWindowUp(leonaApp);
  setTimeout(() => {
    moveWindowUp(leonaApp);
  }, 5000);

  processSaveWinPosition(leonaApp);

  leonaApp.emit('after-show-window');
}

export default showWindow;
