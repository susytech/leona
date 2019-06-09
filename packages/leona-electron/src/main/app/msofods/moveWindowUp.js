// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

/**
 * If the Leona window is restored on a page with a small window height
 * and the window is positioned close to the bottom of the screen, then
 * we do not want it to crop the bottom of the window when the user navigates
 * to a page with a larger window height. So if the user navigates to a page
 * with a larger window height that causes it to be cropped, then we will
 * automatically move the window upward so it is viewable to the user
 */
function moveWindowUp (leonaApp) {
  const { getScreenResolution, win } = leonaApp;

  if (!win) {
    return;
  }

  pino.info('Leona window resized. Moving it back up into view if required');
  const position = win.getPosition();
  const positionStruct = { x: position[0], y: position[1] };
  const trayDepth = leonaApp.trayDepth || 40; // Default incase resizes on load
  const resolution = getScreenResolution();
  const winHeight = win.getSize()[1];
  const maxWinY = resolution.y - winHeight - trayDepth;
  const adjustY = positionStruct.y - maxWinY;

  if (adjustY > 0) {
    leonaApp.emit('moved-window-up-into-view');
    win.setPosition(positionStruct.x, maxWinY);
  }
}

export default moveWindowUp;
