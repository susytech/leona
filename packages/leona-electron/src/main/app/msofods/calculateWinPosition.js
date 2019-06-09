// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function calculateWinPosition (leonaApp, trayPos) {
  const { cachedBounds, options, positioner, tray } = leonaApp;

  if (trayPos && trayPos.x !== 0) {
    // Cache the bounds
    leonaApp.cachedBounds = trayPos;
  } else if (cachedBounds) {
    // Cached value will be used if showWindow is called without bounds data
    trayPos = cachedBounds;
  } else if (tray && tray.getBounds) {
    // Get the current tray bounds
    trayPos = tray.getBounds();
  }

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPosition = null;

  if (
    (trayPos === undefined || (trayPos && trayPos.x === 0)) &&
    options.windowPosition &&
    options.windowPosition.substr(0, 4) === 'tray'
  ) {
    noBoundsPosition =
      process.platform === 'win32' ? 'bottomRight' : 'topRight';
  }

  const position = positioner.calculate(
    noBoundsPosition || options.windowPosition,
    trayPos
  );

  return {
    x: options.x ? options.x : position.x,
    y: options.y ? options.y : position.y
  };
}

export default calculateWinPosition;
